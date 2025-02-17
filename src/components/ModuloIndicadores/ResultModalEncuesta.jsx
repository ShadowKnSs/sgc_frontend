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
import DialogActionButtons from '../DialogActionButtons' // Asegúrate de la ruta correcta

const ResultModalEncuesta = ({ open, onClose, onSave, indicator }) => {
  const [encuestas, setEncuestas] = useState('');
  const [malas, setMalas] = useState('');
  const [regulares, setRegulares] = useState('');
  const [buenas, setBuenas] = useState('');
  const [excelentes, setExcelentes] = useState('');

  useEffect(() => {
    if (open) {
      setEncuestas('');
      setMalas('');
      setRegulares('');
      setBuenas('');
      setExcelentes('');
    }
  }, [open]);

  const handleSave = () => {
    // Convertimos a número y preparamos los datos
    const resultData = {
      encuestas: Number(encuestas),
      malas: Number(malas),
      regulares: Number(regulares),
      buenas: Number(buenas),
      excelentes: Number(excelentes)
    };
    onSave(indicator.id, resultData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Registrar Resultado de Encuesta para: {indicator ? indicator.name : ''}
      </DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="No. de Encuestas"
                type="number"
                fullWidth
                value={encuestas}
                onChange={(e) => setEncuestas(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Respuestas Malas"
                type="number"
                fullWidth
                value={malas}
                onChange={(e) => setMalas(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Respuestas Regulares"
                type="number"
                fullWidth
                value={regulares}
                onChange={(e) => setRegulares(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Respuestas Buenas"
                type="number"
                fullWidth
                value={buenas}
                onChange={(e) => setBuenas(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Respuestas Excelentes"
                type="number"
                fullWidth
                value={excelentes}
                onChange={(e) => setExcelentes(e.target.value)}
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

export default ResultModalEncuesta;
