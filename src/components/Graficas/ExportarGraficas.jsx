import React from 'react';
import { Button } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ExportarGraficas = () => {
  const handleExportPDF = () => {
    const input = document.body;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('graficas_indicadores.pdf');
    });
  };

  return (
    <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={handleExportPDF}>
      Exportar a PDF
    </Button>
  );
};

export default ExportarGraficas;
