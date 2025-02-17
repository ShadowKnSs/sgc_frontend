import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Grid, 
  Box 
} from '@mui/material';
import DialogActionButtons from '../DialogActionButtons'; // Ajusta la ruta según tu estructura

const ResultModalRetroalimentacion = ({ open, onClose, onSave, indicator }) => {
  const [felicitaciones, setFelicitaciones] = useState('');
  const [quejas, setQuejas] = useState('');
  const [sugerencias, setSugerencias] = useState('');

  useEffect(() => {
    if (open) {
      setFelicitaciones('');
      setQuejas('');
      setSugerencias('');
    }
  }, [open]);

  const handleSave = () => {
    const resultData = {
      felicitaciones: Number(felicitaciones),
      quejas: Number(quejas),
      sugerencias: Number(sugerencias)
    };
    onSave(indicator.id, resultData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Registrar Resultado para: {indicator ? indicator.name : ''}
      </DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Felicitaciones"
                type="number"
                fullWidth
                value={felicitaciones}
                onChange={(e) => setFelicitaciones(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Quejas"
                type="number"
                fullWidth
                value={quejas}
                onChange={(e) => setQuejas(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Sugerencias"
                type="number"
                fullWidth
                value={sugerencias}
                onChange={(e) => setSugerencias(e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <DialogActionButtons 
          onCancel={onClose}
          onSave={handleSave}
          saveText="Guardar"
          cancelText="Cancelar"
          saveColor="#F9B800"    // Ajusta según tu paleta
          cancelColor="#0056b3"
        />
      </DialogActions>
    </Dialog>
  );
};

export default ResultModalRetroalimentacion;
