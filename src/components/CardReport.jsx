import React from 'react';
import { Card, CardContent, CardActionArea, Typography, Box, IconButton } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteIcon from '@mui/icons-material/Delete';

const ReportCard = ({ report, onClick, onDelete }) => {
  if (!report) return null;
  // Extraer el año o la fecha completa según lo requieras.
  const reportDate = new Date(report.fechaElaboracion);
  const year = reportDate.getFullYear();
  const formattedDate = reportDate.toLocaleDateString();

  return (
    <Card sx={{ mb: 2, maxWidth: 400, position: 'relative' }}>
      <CardActionArea onClick={onClick}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PictureAsPdfIcon fontSize="large" color="primary" />
          <Box>
            <Typography variant="h6">
              {report.nombreReporte}
            </Typography>
            <Typography variant="body2">
              <strong>Año:</strong> {year}
            </Typography>
            <Typography variant="body2">
              <strong>Fecha:</strong> {formattedDate}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      {/* Ícono de eliminación en la esquina superior derecha */}
      <Box sx={{ position: 'absolute', top: 4, right: 4 }}>
        <IconButton onClick={() => onDelete(report)} size="small">
          <DeleteIcon color="error" />
        </IconButton>
      </Box>
    </Card>
  );
};

export default ReportCard;
