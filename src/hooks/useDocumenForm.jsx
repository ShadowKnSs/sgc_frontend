// src/hooks/useDocumentForm.js
import { useState } from "react";

const initialState = {
  nombreDocumento: "",
  codigoDocumento: "",
  tipoDocumento: "",
  fechaRevision: "",
  fechaVersion: null,
  noRevision: 0,
  noCopias: 0,
  tiempoRetencion: 0,
  lugarAlmacenamiento: "",
  medioAlmacenamiento: "",
  disposicion: "",
  usuarios: [],
  responsable: "",
};

export default function useDocumentForm(defaultValues = initialState) {
  const [data, setData] = useState(defaultValues);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setData(initialState);
    setErrors({});
  };

  const validate = () => {
    const temp = {};

    if (!data.nombreDocumento?.trim()) temp.nombreDocumento = "Este campo es obligatorio";
    if (!data.tipoDocumento) temp.tipoDocumento = "Debe seleccionar un tipo de documento";
    if (data.tipoDocumento === "externo" && !data.fechaVersion) temp.fechaVersion = "Debe seleccionar una fecha";
    if (!data.lugarAlmacenamiento?.trim()) temp.lugarAlmacenamiento = "Este campo es obligatorio";
    if (!data.medioAlmacenamiento) temp.medioAlmacenamiento = "Debe seleccionar un medio de almacenamiento";
    if (!data.disposicion?.trim()) temp.disposicion = "Este campo es obligatorio";

    setErrors(temp);
    return Object.keys(temp).length === 0;
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
