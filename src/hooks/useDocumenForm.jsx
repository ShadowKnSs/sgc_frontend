// src/hooks/useDocumentForm.js
import { useState } from "react";

const initialState = {
  nombreDocumento: "",
  codigoDocumento: "",
  tipoDocumento: "interno",
  fechaVersion: null,
  noRevision: 0,
  fechaRevision: null,
  responsable: "",
  usuarios: [],
  noCopias: 0,
  medioAlmacenamiento: "",
  tiempoRetencion: 0,
  lugarAlmacenamiento: "",
  disposicion: null,
  archivo: null
};

const CHAR_LIMITS = {
  nombreDocumento: 255,
  codigoDocumento: 50,
  responsable: 255,
  lugarAlmacenamiento: 100,
  disposicion: 255 // Asumiendo un límite para disposición también
};

export default function useDocumentForm(defaultValues = initialState) {
  const [data, setData] = useState(defaultValues);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    if (CHAR_LIMITS[field] && typeof value === 'string' && value.length > CHAR_LIMITS[field]) {
      return; // No actualizar si excede el límite
    }
    setData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };
  const validate = () => {
    const newErrors = {};

    // Validar campos requeridos
    if (!data.nombreDocumento.trim()) {
      newErrors.nombreDocumento = "El nombre del documento es requerido";
    } else if (data.nombreDocumento.length > CHAR_LIMITS.nombreDocumento) {
      newErrors.nombreDocumento = `Máximo ${CHAR_LIMITS.nombreDocumento} caracteres`;
    }

    if (!data.responsable.trim()) {
      newErrors.responsable = "El responsable es requerido";
    } else if (data.responsable.length > CHAR_LIMITS.responsable) {
      newErrors.responsable = `Máximo ${CHAR_LIMITS.responsable} caracteres`;
    }

    if (!data.medioAlmacenamiento) {
      newErrors.medioAlmacenamiento = "El medio de almacenamiento es requerido";
    }

    if (!data.lugarAlmacenamiento.trim()) {
      newErrors.lugarAlmacenamiento = "El lugar de almacenamiento es requerido";
    } else if (data.lugarAlmacenamiento.length > CHAR_LIMITS.lugarAlmacenamiento) {
      newErrors.lugarAlmacenamiento = `Máximo ${CHAR_LIMITS.lugarAlmacenamiento} caracteres`;
    }

    // Validar longitud de otros campos
    if (data.codigoDocumento && data.codigoDocumento.length > CHAR_LIMITS.codigoDocumento) {
      newErrors.codigoDocumento = `Máximo ${CHAR_LIMITS.codigoDocumento} caracteres`;
    }

    if (data.disposicion && data.disposicion.length > CHAR_LIMITS.disposicion) {
      newErrors.disposicion = `Máximo ${CHAR_LIMITS.disposicion} caracteres`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setData({
      nombreDocumento: "",
      codigoDocumento: "",
      tipoDocumento: "interno",
      fechaVersion: null,
      noRevision: 0,
      fechaRevision: null,
      responsable: "",
      usuarios: [],
      noCopias: 0,
      medioAlmacenamiento: "",
      tiempoRetencion: 0,
      lugarAlmacenamiento: "",
      disposicion: null,
      archivo: null
    });
    setErrors({});
  };

  return {
    data,
    errors,
    setData,
    setErrors,
    handleChange,
    validate,
    resetForm,
  };
}
