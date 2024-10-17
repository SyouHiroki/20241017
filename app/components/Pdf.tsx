'use client'

import { useState } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import { degrees, PDFDocument } from 'pdf-lib'
import { Tooltip } from 'react-tooltip'
import Image from "next/image"
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.mjs',
//   import.meta.url,
// ).toString()

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const MAX_GEAR = 5
const MIN_GEAR = 0
const DEFAULT_GEAR = 2
const DEFAULT_PAGES_WIDTH = {outter: 200, inner: 176}
const DEFAULT_RATIO = 1.5

export default function Pdf({domain}: {domain: string}) {
  const [pdfData, setPdfData] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const [pagesRotateDegList, setPagesRotateDegList] = useState<number[]>([])
  const [pagesWidth, setPagesWidth] = useState<{outter: number, inner: number}>(DEFAULT_PAGES_WIDTH)
  const [gear, setGear] = useState<number>(DEFAULT_GEAR)
  const [isDragOver, setIsDragOver] = useState<boolean>(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
  
    if (file) {
      if (file.type !== 'application/pdf') {
        console.error('file type error: not pdf file.')
        return
      }

      const fileNameArr = file.name.split('.')
      fileNameArr.pop()
      setFileName(fileNameArr.join())
      const reader = new FileReader()

      reader.onload = (e) => {
        // 保存base64
        setPdfData(e.target?.result as string)
      }
  
      reader.readAsDataURL(file)
    }
  }

  const handleClickUpload = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    
    // 创建一个新的文件输入元素
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.pdf' // 限制只能选择PDF文件

    // 监听文件输入的变化事件
    fileInput.onchange = (e: Event) => {
      const castedEvent = e as unknown as React.ChangeEvent<HTMLInputElement>
      handleFileChange(castedEvent)
    }

    fileInput.click()
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type === 'application/pdf') {
        setFileName(file.name.split('.').slice(0, -1).join('.'))
        const reader = new FileReader()

        reader.onload = (e) => {
          setPdfData(e.target?.result as string)
        };

        reader.readAsDataURL(file)
      } else {
        alert('Only can upload PDF file.')
      }
    }
  }


  const handlePageRotate = (pageNumber: number) => {
    setPagesRotateDegList(preState => {
      const deg = preState[pageNumber]
      const newState = [...preState]
      newState[pageNumber] = deg + 90
      return newState
    })
  }

  const handleRotateAll = () => {
    setPagesRotateDegList(preState => {
      const newState = [...preState]
      newState.forEach((deg, i) => {
        newState[i] = deg + 90
      })
      return newState
    })
  }

  const handleRemovePDF = () => {
    setPdfData('')
    setGear(DEFAULT_GEAR)
    setPagesWidth(DEFAULT_PAGES_WIDTH)
  }

  const handleZoomIn = () => {
    if (gear === MAX_GEAR) return
    setGear(preState => preState + 1)
    setPagesWidth(preState => ({outter: preState.outter * DEFAULT_RATIO, inner: preState.inner * DEFAULT_RATIO}))
  }

  const handleZoomOut = () => {
    if (gear === MIN_GEAR) return
    setGear(preState => preState - 1)
    setPagesWidth(preState => ({outter: preState.outter / DEFAULT_RATIO, inner: preState.inner / DEFAULT_RATIO}))
  }

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setPagesRotateDegList(Array.from({ length: numPages }, () => 0))
  }

  const exportPdfWithRotations = async () => {
    if (!pdfData) return

    const pdfDoc = await PDFDocument.load(pdfData)

    // 遍历所有页并应用旋转
    pdfDoc.getPages().forEach((page, index) => {
      const deg = pagesRotateDegList[index] || 0
      if (deg !== 0) {
        page.setRotation(degrees(deg))
      }
    })

    const modifiedPdfBytes = await pdfDoc.save()

    // 创建 Blob 并下载 PDF
    const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName.replace('.pdf', `${fileName}(${domain}-rotated).pdf`)
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-[#f7f5ef] py-20 flex flex-col items-center text-center">
      <h1 className="text-5xl font-serif">Rotate PDF Pages</h1>
      <p className="my-8 text-gray-600 max-w-lg mx-auto">Simply click on a page to rotate it. You can then download your modified PDF.</p>

      {!pdfData &&
        <div
          onClick={handleClickUpload}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className='border border-[#bfccdd] w-[275px] h-[350px] rounded-md flex flex-col gap-3 items-center justify-center cursor-pointer duration-150'
          style={isDragOver ? {backgroundColor: '#ebebeb', borderStyle: 'solid'} : {backgroundColor: '#ffffff', borderStyle: 'dashed'}}
        >
          <Image src='/assets/upload.svg' draggable={false} width={32} height={32} className="w-8 h-8" alt='upload' />
          <p className="font-medium text-sm leading-6 pointer opacity-75">Click to upload or drag and drop</p>
        </div>
      }

      {pdfData &&
        <div>
          {/* 按钮组 */}
          <div className="text-white font-medium flex gap-3 justify-center">
            <div className="rounded-md bg-[#ff612f] p-2 cursor-pointer duration-100 hover:scale-[1.02] shadow select-none" onClick={handleRotateAll}>Rotate all</div>

            <div id='removePDF' className="rounded-md bg-[#1f2937] p-2 cursor-pointer duration-100 hover:scale-[1.02] shadow select-none" onClick={handleRemovePDF}>
              Remove PDF
              <Tooltip content='Remove this PDF and select a new one' anchorSelect="#removePDF" />
            </div>

            <div
              className="rounded-full bg-white w-10 h-10 flex justify-center items-center duration-100 hover:scale-[1.05] relative shadow"
              onClick={handleZoomIn}
              style={gear === MAX_GEAR ? {cursor: 'default'} : {cursor: 'pointer'}}
              id='zoomIn'
            >
              {gear === MAX_GEAR && <div className="absolute w-10 h-10 rounded-full bg-[rgba(225,225,225,0.4)] top-0 left-0"></div>}
              <Image src='/assets/zoom-in.svg' width={20} height={20} className="w-5 h-5 select-none" draggable={false} alt='zoom-in' />
              <Tooltip content='Zoom in' anchorSelect="#zoomIn" />
            </div>

            <div
              className="rounded-full bg-white w-10 h-10 flex justify-center items-center duration-100 hover:scale-[1.05] relative shadow"
              onClick={handleZoomOut}
              style={gear === MIN_GEAR ? {cursor: 'default'} : {cursor: 'pointer'}}
              id='zoomOut'
            >
              {gear === MIN_GEAR && <div className="absolute w-10 h-10 rounded-full bg-[rgba(225,225,225,0.4)] top-0 left-0"></div>}
              <Image src='/assets/zoom-out.svg' width={20} height={20} className="w-5 h-5 select-none" draggable={false} alt='zoom-out' />
              <Tooltip content='Zoom out' anchorSelect="#zoomOut" />
            </div>
          </div>

          <div className="my-8 px-20">
            <Document file={pdfData} onLoadSuccess={onDocumentLoadSuccess}>
              <div className="flex flex-wrap justify-center gap-6">
                {pagesRotateDegList.map((v, i) => (
                  // 外框
                  <div
                    key={i + 1}
                    className="bg-white overflow-hidden relative cursor-pointer p-3 flex justify-center items-center flex-col hover:bg-[#ebebeb] duration-100 shadow"
                    onClick={() => handlePageRotate(i)}
                    style={{width: `${pagesWidth.outter}px`}}
                  >
                    {/* 旋转角标图标 */}
                    <div className="absolute bg-[#ff612f] h-5 w-5 rounded-full z-50 right-1 top-1 flex justify-center items-center hover:scale-[1.1] duration-100 shadow">
                      <Image src='/assets/rotate.svg' width={12} height={12} className="w-3 h-3 select-none" alt='rotate' draggable={false} />
                    </div>

                    {/* pdf的其中一页 */}
                    <div className="duration-100" style={{transform: `rotate(${pagesRotateDegList[i]}deg)`}}>
                      <Page pageNumber={i + 1} width={pagesWidth.inner} className="pointer-events-none" />
                    </div>

                    {/* 页数 */}
                    <div className="text-xs">{i}</div>
                  </div>
                ))}
              </div>
            </Document>
          </div>
        </div>
      }

      {pdfData &&
        <div className="rounded-md bg-[#ff612f] p-2 text-white font-medium cursor-pointer duration-100 hover:scale-[1.02] shadow select-none" onClick={exportPdfWithRotations} id='download'>
          Download
          <Tooltip content='Split and download PDF' anchorSelect="#download" />
        </div>
      }
      
    </div>
  )
}
