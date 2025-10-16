// src/hooks/useDocumentForm.js
import { useState, useCallback } from "react"; 

const initialState = {
  nombreDocumento: "",
  codigoDocumento: "",
  tipoDocumento: "interno",
  fechaVersion: "",
  noRevision: "",  // String vacío
  fechaRevision: "",
  responsable: "",
  usuarios: [],
  noCopias: "",  // String vacío
  medioAlmacenamiento: "",
  tiempoRetencion: "",  // String vacío
  lugarAlmacenamiento: "",
  disposicion: "",
  archivo: null
};

const CHAR_LIMITS = {
  nombreDocumento: 255,
  codigoDocumento: 50,
  responsable: 255,
  lugarAlmacenamiento: 100,
  disposicion: 255
};

export default function useDocumentForm(defaultValues = initialState) {
  const [data, setData] = useState(defaultValues);
  const [errors, setErrors] = useState({});

  // Memoizado para estabilidad
  const handleChange = useCallback((field, value) => {
    setData(prev => {
      if (Object.is(prev[field], value)) return prev;
      return { ...prev, [field]: value };
    });

    setErrors(prev => {
      if (!prev[field]) return prev;
      const { [field]: _omit, ...rest } = prev;
      return rest;
    });
  }, []);  // Dependencias vacías: setData y setErrors son estables

  const validate = useCallback(() => {  // Opcional: memoizar
    const newErrors = {};

    if (!String(data.nombreDocumento ?? "").trim()) {
      newErrors.nombreDocumento = "El nombre del documento es requerido";
    } else if ((data.nombreDocumento || "").length > CHAR_LIMITS.nombreDocumento) {
      newErrors.nombreDocumento = `Máximo ${CHAR_LIMITS.nombreDocumento} caracteres`;
    }

    if (!String(data.responsable ?? "").trim()) {
      newErrors.responsable = "El responsable es requerido";
    } else if ((data.responsable || "").length > CHAR_LIMITS.responsable) {
      newErrors.responsable = `Máximo ${CHAR_LIMITS.responsable} caracteres`;
    }

    if (!String(data.medioAlmacenamiento ?? "")) {
      newErrors.medioAlmacenamiento = "El medio de almacenamiento es requerido";
    }

    if (!String(data.lugarAlmacenamiento ?? "").trim()) {
      newErrors.lugarAlmacenamiento = "El lugar de almacenamiento es requerido";
    } else if ((data.lugarAlmacenamiento || "").length > CHAR_LIMITS.lugarAlmacenamiento) {
      newErrors.lugarAlmacenamiento = `Máximo ${CHAR_LIMITS.lugarAlmacenamiento} caracteres`;
    }

    if (String(data.codigoDocumento || "").length > CHAR_LIMITS.codigoDocumento) {
      newErrors.codigoDocumento = `Máximo ${CHAR_LIMITS.codigoDocumento} caracteres`;
    }

    if (String(data.disposicion || "").length > CHAR_LIMITS.disposicion) {
      newErrors.disposicion = `Máximo ${CHAR_LIMITS.disposicion} caracteres`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [data]);  

  const resetForm = useCallback(() => { 
    setData(initialState);
    setErrors({});
  }, []);

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
