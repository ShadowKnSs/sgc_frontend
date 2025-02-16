import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Typography 
} from '@mui/material';

const AddIndicatorForm = ({ open, onClose, onSave }) => {
  const [tipo, setTipo] = useState('');
  const [nombre, setNombre] = useState('');
  const [periodo, setPeriodo] = useState('Semestral'); // valor por defecto
  const [meta, setMeta] = useState('');

  // Opcional: Reiniciar campos cada vez que se abra el modal
  useEffect(() => {
    if (open) {
      setTipo('');
      setNombre('');
      setPeriodo('Semestral');
      setMeta('');
    }
  }, [open]);

  const handleSave = () => {
    // Preparamos los datos del indicador
    const indicatorData = { tipo, nombre, periodo, meta };
    onSave(indicatorData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Agregar Indicador</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel id="tipo-indicador-label">Tipo de Indicador</InputLabel>
          <Select
            labelId="tipo-indicador-label"
            value={tipo}
            label="Tipo de Indicador"
            onChange={(e) => setTipo(e.target.value)}
          >
            <MenuItem value="Plan de control">Plan de control</MenuItem>
            <MenuItem value="Encuesta de Satisfacción">Encuesta de Satisfacción</MenuItem>
            <MenuItem value="Retroalimentación">Retroalimentación</MenuItem>
            <MenuItem value="Mapa de proceso">Mapa de proceso</MenuItem>
            <MenuItem value="Gestión de Riesgos">Gestión de Riesgos</MenuItem>
            <MenuItem value="Evaluación de proveedores">Evaluación de proveedores</MenuItem>
          </Select>
        </FormControl>

        <TextField 
          margin="normal"
          label="Nombre / Descripción"
          fullWidth
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <FormControl component="fieldset" margin="normal">
          <Typography variant="subtitle1">Periodo de Evaluación</Typography>
          <RadioGroup 
            row
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
          >
            <FormControlLabel value="Semestral" control={<Radio />} label="Semestral" />
            <FormControlLabel value="Anual" control={<Radio />} label="Anual" />
          </RadioGroup>
        </FormControl>

        <TextField 
          margin="normal"
          label="Meta"
          fullWidth
          value={meta}
          onChange={(e) => setMeta(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddIndicatorForm;
