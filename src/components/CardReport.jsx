import React from 'react';
import { Card, CardContent, CardActionArea, Typography, Box } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const ReportCard = ({ report, onClick }) => {
  if (!report) return null;

  // Extraer el año de la fecha de elaboración
  const year = new Date(report.fechaElaboracion).getFullYear();

  return (
    <Card sx={{ mb: 2, maxWidth: 400 }}>
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
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ReportCard;
