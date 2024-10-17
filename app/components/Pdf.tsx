'use client'

import { useState } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css';
// import Image from "next/image"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function Pdf() {
  const [pdfData, setPdfData] = useState<string | ArrayBuffer | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [pagesRotateDegList, setPagesRotateDegList] = useState<number[]>([])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPdfData(e.target?.result as ArrayBuffer)
      }
      reader.readAsArrayBuffer(file)
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
    setPagesRotateDegList(Array.from({length: numPages}, () => 0))
  }

  return (
    <div>
      <Document file={pdfData} onLoadSuccess={onDocumentLoadSuccess} >
        {pagesRotateDegList.map((v, i) => <Page rotate={pagesRotateDegList[i]} pageNumber={i + 1} key={i + 1} onClick={() => handlePageRotate(i)} />)}
      </Document>

      <input type='file' onChange={handleFileChange}/>

      <div>filename:{fileName}</div>

    </div>
  )
}
