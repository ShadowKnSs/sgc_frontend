import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ReporteProcesoPreview = () => {
    const [file, setFile] = useState(null);

    const handleGeneratePDF = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/generar-reporte", {
                method: "GET",
                headers: {
                    "Content-Type": "application/pdf",
                },
            });
            
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setFile(url);
        } catch (error) {
            console.error("Error al generar el PDF", error);
        }
    };

    return (
        <div className="container mx-auto p-5">
            <h2 className="text-xl font-bold mb-4">Vista Previa del Reporte de Proceso</h2>
            <button onClick={handleGeneratePDF} className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4">
                Generar y Previsualizar PDF
            </button>
            
            {file && (
                <div className="border p-4">
                    <Document file={file} onLoadError={console.error}>
                        <Page pageNumber={1} />
                    </Document>
                    <a href={file} download="ReporteProceso.pdf" className="px-4 py-2 bg-green-500 text-white rounded-md mt-4 inline-block">Descargar PDF</a>
                </div>
            )}
        </div>
    );
};

export default ReporteProcesoPreview;
