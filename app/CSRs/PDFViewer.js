// "use client";

// import { useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/Page/AnnotationLayer.css";
// import "react-pdf/dist/Page/TextLayer.css";

// // ✅ Fix: use CDN worker
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// export default function PDFViewer({ fileUrl }) {
//   const [numPages, setNumPages] = useState(0);
//   const [pageNumber, setPageNumber] = useState(1);

//   function onDocumentLoadSuccess({ numPages }) {
//     setNumPages(numPages);
//     setPageNumber(1);
//   }

//   return (
//     <div className="flex flex-col items-center gap-4">
//       <Document
//         file={fileUrl}
//         onLoadSuccess={onDocumentLoadSuccess}
//         loading={<p>Loading PDF...</p>}
//         error={<p>Failed to load PDF.</p>}
//       >
//         <Page pageNumber={pageNumber} />
//       </Document>

//       <p>
//         Page {pageNumber} of {numPages}
//       </p>

//       <div className="flex gap-2">
//         <button
//           disabled={pageNumber <= 1}
//           onClick={() => setPageNumber((p) => p - 1)}
//           className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
//         >
//           Prev
//         </button>
//         <button
//           disabled={pageNumber >= numPages}
//           onClick={() => setPageNumber((p) => p + 1)}
//           className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";

export default function PDFViewer({ selectedCSR }) {
  if (!selectedCSR?.filePath) return null; // nothing to download

  return (
    <a
      href={selectedCSR.filePath}
      download={`CSR-Attachment-${selectedCSR.csrNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow inline-block"
    >
      Download Attachment
    </a>
  );
}
