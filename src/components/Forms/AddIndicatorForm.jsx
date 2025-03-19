import React, { useState, useEffect } from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import GenericModal from '../Modals/GenericModal';

const AddIndicatorFormContent = ({ formData, setFormData }) => {
  return (
    <Box component="form" sx={{ mt: 2 }}>
      {/* Selección del Tipo de Indicador */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="tipo-indicador-label">Tipo de Indicador</InputLabel>
        <Select
          labelId="tipo-indicador-label"
          value={formData.origenIndicador || ''}
          label="Tipo de Indicador"
          onChange={(e) => setFormData({ ...formData, origenIndicador: e.target.value })}
          required
        >
          <MenuItem value="Encuesta">Encuesta</MenuItem>
          <MenuItem value="EvaluaProveedores">Evaluación de Proveedores</MenuItem>
          <MenuItem value="Retroalimentacion">Retroalimentación</MenuItem>
        </Select>
      </FormControl>

      {/* Campo para Meta (Ahora se solicita en todos los tipos de indicador) */}
      <TextField
        fullWidth
        margin="normal"
        label="Meta"
        type="number"
        value={formData.meta || ''}
        onChange={(e) => setFormData({ ...formData, meta: parseInt(e.target.value, 10) })}
        required
      />

      {/* Campos de meta solo para Evaluación de Proveedores */}
      {formData.origenIndicador === 'EvaluaProveedores' && (
        <>
          <TextField fullWidth margin="normal" label="Meta Confiable" type="number" value={formData.metaConfiable || ''} onChange={(e) => setFormData({ ...formData, metaConfiable: parseInt(e.target.value, 10) })} required />
          <TextField fullWidth margin="normal" label="Meta Condicionado" type="number" value={formData.metaCondicionado || ''} onChange={(e) => setFormData({ ...formData, metaCondicionado: parseInt(e.target.value, 10) })} required />
          <TextField fullWidth margin="normal" label="Meta No Confiable" type="number" value={formData.metaNoConfiable || ''} onChange={(e) => setFormData({ ...formData, metaNoConfiable: parseInt(e.target.value, 10) })} required />
        </>
      )}

      {/* Para Retroalimentación, se solicita el campo Método */}
      {formData.origenIndicador === 'Retroalimentacion' && (
        <FormControl fullWidth margin="normal">
          <InputLabel id="metodo-label">Método</InputLabel>
          <Select
            labelId="metodo-label"
            value={formData.metodo || ''}
            label="Método"
            onChange={(e) => setFormData({ ...formData, metodo: e.target.value })}
            required
          >
            <MenuItem value="Buzon Virtual">Buzón Virtual</MenuItem>
            <MenuItem value="Buzon Fisico">Buzón Físico</MenuItem>
            <MenuItem value="Encuesta">Encuesta</MenuItem>
          </Select>
        </FormControl>
      )}
    </Box>
  );
};

const AddIndicatorForm = ({ open, onClose, onSave, idRegistro, initialValues = {} }) => {
  const defaultState = {
    idRegistro: idRegistro || "",
    origenIndicador: "",
    meta: "",
    metaConfiable: "",
    metaCondicionado: "",
    metaNoConfiable: "",
    metodo: "",
  };

  const [formData, setFormData] = useState({ ...defaultState, ...initialValues });

  useEffect(() => {
    setFormData(prev => ({ ...prev, idRegistro }));
  }, [idRegistro]);

  const handleSave = () => {
    console.log("Guardando indicador, payload antes de asignar periodicidad:", formData);

    if (!formData.origenIndicador) {
      alert("Debe seleccionar un tipo de indicador.");
      return;
    }

    let periodicidad = "";
    if (formData.origenIndicador === "Encuesta" || formData.origenIndicador === "Retroalimentacion") {
      periodicidad = "Anual";
    } else if (formData.origenIndicador === "EvaluaProveedores") {
      periodicidad = "Semestral";
    }

    const payload = {
      origenIndicador: formData.origenIndicador,
      nombreIndicador:
        formData.origenIndicador === "Encuesta"
          ? "Encuesta de Satisfacción"
          : formData.origenIndicador === "Retroalimentacion"
            ? `Retroalimentacion ${formData.metodo}`
            : formData.origenIndicador === "EvaluaProveedores"
              ? "Evaluación de proveedores"
              : "",
      periodicidad, // Se asigna directamente en base al tipo
      idRegistro: parseInt(formData.idRegistro, 10),
      meta: parseInt(formData.meta, 10),
    };

    if (formData.origenIndicador === 'EvaluaProveedores') {
      payload.metaConfiable = parseInt(formData.metaConfiable, 10);
      payload.metaCondicionado = parseInt(formData.metaCondicionado, 10);
      payload.metaNoConfiable = parseInt(formData.metaNoConfiable, 10);
    }

    if (formData.origenIndicador === 'Retroalimentacion') {
      payload.metodo = formData.metodo;
    }

    console.log("Payload final antes de enviar:", payload);
    onSave(payload);
  };

  return (
    <GenericModal
      open={open}
      onClose={onClose}
      onSave={handleSave}
      title="Agregar Indicador"
      initialState={formData}
      saveColor="terciary.main"
      cancelColor="primary.main"
    >
      <AddIndicatorFormContent formData={formData} setFormData={setFormData} />
    </GenericModal>
  );
};

export default AddIndicatorForm;
