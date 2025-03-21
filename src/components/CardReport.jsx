// components/ReportCard.jsx
import React from 'react';
import { Card, CardContent, CardActionArea, Typography, Box } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const ReportCard = ({ report, onClick }) => {
  if (!report) return null;

  return (
    <Card sx={{ mb: 2, maxWidth: 400 }}>
      <CardActionArea onClick={onClick}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Ícono de reporte */}
          <PictureAsPdfIcon fontSize="large" color="primary" />
          <Box>
            <Typography variant="h6">Reporte</Typography>
            <Typography variant="body1">
              <strong>Proceso:</strong> {report.processName}
            </Typography>
            <Typography variant="body1">
              <strong>Entidad:</strong> {report.entityName}
            </Typography>
            <Typography variant="body1">
              <strong>Año:</strong> {report.year}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ReportCard;
