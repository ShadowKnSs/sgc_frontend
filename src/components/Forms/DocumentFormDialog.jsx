// src/components/Forms/DocumentFormDialog.jsx
import React, { useState, useCallback } from "react";
import {
  Dialog, DialogContent, DialogActions,
  TextField, MenuItem, Box, Typography,
  FormGroup, FormControlLabel, Checkbox
} from "@mui/material";
import CustomButton from "../Button";
import DialogTitleCustom from "../TitleDialog";

const USUARIOS_OPCIONES = [
  "ALUMNOS",
  "PERSONAL ADMINISTRATIVO",
  "FUNCIONARIADO",
  "FUNCIONARIOS",
  "COORDINADORES DE SERVICIO SOCIAL",
];

const CHAR_LIMITS = {
  nombreDocumento: 255,
  codigoDocumento: 50,
  responsable: 255,
  lugarAlmacenamiento: 100,
  disposicion: 255,
};

const MEDIOS = [
  { value: "Físico",  label: "Físico" },
  { value: "Digital", label: "Electrónico" },
  { value: "Ambos",   label: "Físico y Electrónico" },
];

const RequiredLabel = ({ children }) => (
  <Box component="span">
    {children}
    <Box component="span" sx={{ color: "error.main" }}>*</Box>
  </Box>
);

const renderHelper = (value, limit, error) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
    <span style={{ color: error ? "#d32f2f" : "inherit" }}>
      {error || ""}
    </span>
    <span style={{ color: (value?.length || 0) >= limit ? "#d32f2f" : "inherit" }}>
      {(value?.length || 0)}/{limit}
    </span>
  </Box>
);

const DocumentFormDialog = ({
  open,
  onClose,
  modo = "crear",
  data = {},
  onChange,
  onSubmit,
  errors = {},
  submitting = false,
  showSnackbar,
}) => {
  const esExterno = data?.tipoDocumento === "externo";

  // Solo para mostrar el nombre del archivo seleccionado
  const [archivoLocal, setArchivoLocal] = useState(null);

  // IMPORTANTÍSIMO: NO convertir tipos aquí. Siempre strings durante edición.
  const handleFieldChange = useCallback((field) => (event) => {
    const value = event.target.value; // string (incluye "")
    onChange(field, value);
  }, [onChange]);

  // Cambio de tipo de documento: limpiar dependientes con strings
  const handleTipoDocumentoChange = useCallback((event) => {
    const tipo = event.target.value;
    onChange("tipoDocumento", tipo);

    if (tipo !== "externo") {
      onChange("fechaVersion", "");
      onChange("noRevision", "");
    } else {
      onChange("fechaRevision", "");
      onChange("codigoDocumento", "");
    }
  }, [onChange]);

  const handleUsuariosToggle = useCallback((usuario) => (event) => {
    const checked = event.target.checked;
    const current = Array.isArray(data?.usuarios) ? data.usuarios : [];
    const next = checked ? [...current, usuario] : current.filter((u) => u !== usuario);
    onChange("usuarios", next);
  }, [data?.usuarios, onChange]);

  const handleFileChange = useCallback((event) => {
    const file = event.target.files?.[0] || null;
    setArchivoLocal(file);
    onChange("archivo", file);
  }, [onChange]);

  const handleSubmitClick = useCallback(() => {
    const obligatorios = ["nombreDocumento", "tipoDocumento", "responsable", "medioAlmacenamiento", "lugarAlmacenamiento"];
    const vacios = obligatorios.filter(c => !String(data?.[c] ?? "").trim());
    if (vacios.length) {
      showSnackbar?.("Por favor complete todos los campos obligatorios", "error", "Error de validación");
      return;
    }
    onSubmit();
  }, [data, onSubmit, showSnackbar]);

  const handleClose = useCallback(() => {
    setArchivoLocal(null);
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitleCustom
        title={modo === "editar" ? "Editar Documento" : "Agregar Nuevo Documento"}
        subtitle="Completa los campos requeridos para el documento"
      />

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
          <TextField
            label={<RequiredLabel>Nombre del Documento</RequiredLabel>}
            fullWidth
            variant="outlined"
            value={data?.nombreDocumento ?? ""}
            onChange={handleFieldChange("nombreDocumento")}
            error={!!errors.nombreDocumento}
            helperText={renderHelper(data?.nombreDocumento ?? "", CHAR_LIMITS.nombreDocumento, errors.nombreDocumento)}
            inputProps={{ maxLength: CHAR_LIMITS.nombreDocumento }}
            disabled={submitting}
          />

          <TextField
            label={<RequiredLabel>Tipo de Documento</RequiredLabel>}
            select
            fullWidth
            variant="outlined"
            value={data?.tipoDocumento ?? ""}
            onChange={handleTipoDocumentoChange}
            error={!!errors.tipoDocumento}
            helperText={errors.tipoDocumento}
            disabled={submitting}
          >
            <MenuItem value="interno">INT</MenuItem>
            <MenuItem value="externo">EXT</MenuItem>
          </TextField>

          {!esExterno && (
            <TextField
              label="Código del Documento"
              fullWidth
              variant="outlined"
              value={data?.codigoDocumento ?? ""}
              onChange={handleFieldChange("codigoDocumento")}
              error={!!errors.codigoDocumento}
              helperText={errors.codigoDocumento || `Máximo ${CHAR_LIMITS.codigoDocumento} caracteres`}
              inputProps={{ maxLength: CHAR_LIMITS.codigoDocumento }}
              disabled={submitting}
            />
          )}

          {esExterno && (
            <>
              <TextField
                label="Fecha de Última Versión"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                variant="outlined"
                value={data?.fechaVersion ?? ""}
                onChange={handleFieldChange("fechaVersion")}
                error={!!errors.fechaVersion}
                helperText={errors.fechaVersion}
                disabled={submitting}
              />

              {/* Numéricos como texto + inputMode para no forzar 0/NaN */}
              <TextField
                label="Número de Revisión"
                fullWidth
                type="text"
                inputMode="numeric"
                variant="outlined"
                value={data?.noRevision ?? ""}
                onChange={handleFieldChange("noRevision")}
                error={!!errors.noRevision}
                helperText={errors.noRevision}
                disabled={submitting}
              />
            </>
          )}

          {!esExterno && (
            <TextField
              label="Fecha de Revisión"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              variant="outlined"
              value={data?.fechaRevision ?? ""}
              onChange={handleFieldChange("fechaRevision")}
              error={!!errors.fechaRevision}
              helperText={errors.fechaRevision}
              disabled={submitting}
            />
          )}

          <TextField
            label={<RequiredLabel>Responsable</RequiredLabel>}
            fullWidth
            variant="outlined"
            value={data?.responsable ?? ""}
            onChange={handleFieldChange("responsable")}
            error={!!errors.responsable}
            helperText={renderHelper(data?.responsable ?? "", CHAR_LIMITS.responsable, errors.responsable)}
            inputProps={{ maxLength: CHAR_LIMITS.responsable }}
            disabled={submitting}
          />

          <Box>
            <Typography sx={{ fontWeight: "bold", mb: 1 }}>Usuarios:</Typography>
            <FormGroup row>
              {USUARIOS_OPCIONES.map((usuario) => {
                const checked = (data?.usuarios ?? []).includes(usuario);
                return (
                  <FormControlLabel
                    key={usuario}
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={handleUsuariosToggle(usuario)}
                        disabled={submitting}
                      />
                    }
                    label={usuario}
                  />
                );
              })}
            </FormGroup>
          </Box>

          <TextField
            label="No. Copias"
            fullWidth
            type="text"
            inputMode="numeric"
            variant="outlined"
            value={data?.noCopias ?? ""}
            onChange={handleFieldChange("noCopias")}
            disabled={submitting}
          />

          <TextField
            label={<RequiredLabel>Medio de Almacenamiento</RequiredLabel>}
            select
            fullWidth
            variant="outlined"
            value={data?.medioAlmacenamiento ?? ""}
            onChange={handleFieldChange("medioAlmacenamiento")}
            error={!!errors.medioAlmacenamiento}
            helperText={errors.medioAlmacenamiento}
            disabled={submitting}
          >
            {MEDIOS.map((m) => (
              <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Tiempo de Retención"
            fullWidth
            type="text"
            inputMode="numeric"
            variant="outlined"
            value={data?.tiempoRetencion ?? ""}
            onChange={handleFieldChange("tiempoRetencion")}
            disabled={submitting}
          />

          <TextField
            label={<RequiredLabel>Lugar de Almacenamiento</RequiredLabel>}
            fullWidth
            variant="outlined"
            value={data?.lugarAlmacenamiento ?? ""}
            onChange={handleFieldChange("lugarAlmacenamiento")}
            error={!!errors.lugarAlmacenamiento}
            helperText={renderHelper(
              data?.lugarAlmacenamiento ?? "",
              CHAR_LIMITS.lugarAlmacenamiento,
              errors.lugarAlmacenamiento
            )}
            inputProps={{ maxLength: CHAR_LIMITS.lugarAlmacenamiento }}
            disabled={submitting}
          />

          <TextField
            label="Disposición después del Periodo de Retención"
            fullWidth
            variant="outlined"
            value={data?.disposicion ?? ""}
            onChange={handleFieldChange("disposicion")}
            error={!!errors.disposicion}
            helperText={renderHelper(
              data?.disposicion ?? "",
              CHAR_LIMITS.disposicion,
              errors.disposicion
            )}
            inputProps={{ maxLength: CHAR_LIMITS.disposicion }}
            disabled={submitting}
          />

          {!esExterno && (
            <Box>
              <Typography sx={{ fontWeight: "bold", mb: 1 }}>Subir Archivo</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <label htmlFor="archivo-upload">
                  <input
                    id="archivo-upload"
                    type="file"
                    hidden
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                    onChange={handleFileChange}
                    disabled={submitting}
                  />
                  <CustomButton component="span" type="descargar" disabled={submitting}>
                    Seleccionar archivo
                  </CustomButton>
                </label>
                {(archivoLocal || data?.archivo) && (
                  <Typography variant="body2">
                    {archivoLocal?.name || (typeof data.archivo === "string" ? data.archivo : "")}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", padding: 2 }}>
        <CustomButton type="cancelar" onClick={handleClose} disabled={submitting}>
          Cancelar
        </CustomButton>
        <CustomButton
          type="guardar"
          onClick={handleSubmitClick}
          loading={submitting}
          loadingLabel="Guardando..."
          disabled={submitting}
        >
          {modo === "editar" ? "Guardar Cambios" : "Guardar"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentFormDialog;

