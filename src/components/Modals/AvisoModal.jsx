// components/Modals/WarningModal.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Divider
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CustomButton from '../Button';

const colorPalette = {
  azulOscuro: '#1565C0',
  azulClaro: '#42A5F5',
  grisFondo: '#F5F7FA',
  grisBorde: '#E6E9EF',
  naranja: '#F9A825',
};

const WarningModal = ({ open, onClose, reportName, year }) => {
  const titleId = 'warning-modal-title';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          border: `1px solid ${colorPalette.grisBorde}`,
        },
      }}
    >
      {/* Encabezado */}
      <DialogTitle
        id={titleId}
        sx={{
          px: 3,
          py: 2,
          bgcolor: colorPalette.azulOscuro,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.15)',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <WarningIcon sx={{ fontSize: 22, color: 'white' }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Reporte existente
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          px: 3,
          py: 3,
          bgcolor: colorPalette.grisFondo,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: 65,
              height: 65,
              mx: 'auto',
              mb: 2,
              mt: 1,
              borderRadius: '50%',
              bgcolor: 'rgba(249,168,37,0.12)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <WarningIcon sx={{ fontSize: 38, color: colorPalette.naranja }} />
          </Box>

          <Typography variant="body1" sx={{ color: 'text.primary' }}>
            Ya existe el reporte{' '}
            <Box component="span" sx={{ color: colorPalette.azulClaro, fontWeight: 700 }}>
              {reportName} {year}
            </Box>
            .
          </Typography>

          <Typography variant="body2" sx={{ mt: 1.5, color: 'text.secondary' }}>
            No es posible generar un nuevo reporte con el mismo nombre y año.
          </Typography>
        </Box>
      </DialogContent>

      <Divider sx={{ borderColor: colorPalette.grisBorde }} />

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          bgcolor: '#fff',
          justifyContent: 'center',
          gap: 1.5,
        }}
      >
        <CustomButton type="aceptar" onClick={onClose}>
          Aceptar
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default WarningModal;
