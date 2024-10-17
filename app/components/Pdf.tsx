'use client'

import { useState } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import { degrees, PDFDocument } from 'pdf-lib'
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

  const handlePageRotate = (pageNumber: number) => {
    setPagesRotateDegList(preState => {
      let deg = preState[pageNumber]
      const newState = [...preState]
      deg = deg + 90 >= 360 ? 0 : deg + 90
      newState[pageNumber] = deg
      return newState
    })
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
    <div>
      <Document file={pdfData} onLoadSuccess={onDocumentLoadSuccess}>
        {pagesRotateDegList.map((v, i) => <Page rotate={pagesRotateDegList[i]} pageNumber={i + 1} key={i + 1} onClick={() => handlePageRotate(i)} />)}
      </Document>

      <input type='file' onChange={handleFileChange} />
      <div>filename: {fileName}</div>
      <button onClick={exportPdfWithRotations}>export pdf</button>
    </div>
  )
}
