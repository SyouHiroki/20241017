'use client'

import { useState } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import { degrees, PDFDocument } from 'pdf-lib'
import Image from "next/image"
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

export default function Pdf() {
  const [pdfData, setPdfData] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const [pagesRotateDegList, setPagesRotateDegList] = useState<number[]>([])
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
      let deg = preState[pageNumber]
      const newState = [...preState]
      deg = deg + 90 >= 360 ? 0 : deg + 90
      newState[pageNumber] = deg
      return newState
    })
  }

  const handleRotateAll = () => {
    setPagesRotateDegList(preState => {
      const newState = [...preState]
      newState.forEach((deg, i) => {
        newState[i] = deg + 90 >= 360 ? 0 : deg + 90
      })
      return newState
    })
  }

  const handleRemovePDF = () => {
    setPdfData('')
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
    a.download = fileName.replace('.pdf', `${fileName}_${new Date().getTime()}.pdf`)
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-[#f7f5ef] py-20 flex flex-col items-center">
      <h1 className="text-5xl font-serif">Rotate PDF Pages</h1>
      <p className="my-8 text-gray-600 max-w-lg mx-auto text-center">Simply click on a page to rotate it. You can then download your modified PDF.</p>

      {!pdfData &&
        <div
          onClick={handleClickUpload}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className='border border-[#bfccdd] w-[275px] h-[350px] rounded-md flex flex-col gap-3 items-center justify-center cursor-pointer duration-150'
          style={isDragOver ? {backgroundColor: '#ebebeb', borderStyle: 'solid'} : {backgroundColor: '#ffffff', borderStyle: 'dashed'}}
        >
          <Image src='/assets/upload.svg' width={32} height={32} className="w-8 h-8" alt='logo' />
          <p className="font-medium text-sm leading-6 pointer opacity-75">Click to upload or drag and drop</p>
        </div>
      }

      {pdfData &&
        <div>
          <div className="text-white font-medium flex gap-3 justify-center">
            <div className="rounded-md bg-[#ff612f] p-2 cursor-pointer" onClick={handleRotateAll}>Rotate all</div>
            <div className='rounded-md bg-[#1f2937] p-2 cursor-pointer' onClick={handleRemovePDF}>Remove PDF</div>
          </div>

          <Document file={pdfData} onLoadSuccess={onDocumentLoadSuccess}>
            {pagesRotateDegList.map((v, i) => <Page rotate={pagesRotateDegList[i]} pageNumber={i + 1} key={i + 1} onClick={() => handlePageRotate(i)} />)}
          </Document>
        </div>
      }

      

      {/* <button onClick={exportPdfWithRotations}>export pdf</button> */}
    </div>
  )
}
