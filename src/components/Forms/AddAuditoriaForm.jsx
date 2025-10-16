import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Chip,
  Checkbox,
  ListItemText,
  Typography,
  Grid,
} from "@mui/material";
import CustomButton from "../Button";
import DialogTitleCustom from "../TitleDialog";


const AuditoriaForm = ({
  open,
  onClose,
  formData,
  onChange,
  onSubmit,
  entidades = [],
  procesos = [],
  auditores = [],
  isEditing = false,
  saving = false,
  onEntidadChange,
  procesosCE = []
}) => {
  // touched: objeto { campo: true } para controlar errores en tiempo real
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const leader = Number(formData.auditorLider);
    if (!Number.isNaN(leader) && Array.isArray(formData.auditoresAdicionales)) {
      const cleaned = formData.auditoresAdicionales.map(Number).filter((id) => id !== leader);
      if (cleaned.length !== formData.auditoresAdicionales.length) {
        onChange({ target: { name: "auditoresAdicionales", value: cleaned } });
      }
    }
  }, [formData.auditorLider]);
  
  // Reset touched al abrir el formulario o cuando cambie el formData (edición)
  useEffect(() => {
    if (open) setTouched({});
  }, [open, formData?.idAuditoria]);

  // helper para marcar touched y delegar la llamada real
  const handleLocalChange = (e) => {
    // e puede ser un Event-like o un objeto { target: { name, value } } o un objeto custom { target: {...} }
    const name = e?.target?.name ?? e?.name;
    if (name) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
    onChange(e);
  };

  // Validaciones por campo (retornan string con mensaje o null si ok)
  const validators = {
    procesoId: () => {
      if (Array.isArray(procesosCE) && procesosCE.length > 0) {
        return !formData.procesoId ? "Selecciona Entidad - Proceso." : null;
      }
      return null;
    },
    entidad: () => {
      if (!Array.isArray(procesosCE) || procesosCE.length === 0) {
        return !formData.entidad ? "Selecciona una entidad." : null;
      }
      return null;
    },
    proceso: () => {
      if (!Array.isArray(procesosCE) || procesosCE.length === 0) {
        return !formData.proceso ? "Selecciona un proceso." : null;
      }
      return null;
    },
    fecha: () => {
      if (!formData.fecha) return "Selecciona la fecha.";
      // opcional: validar >= hoy
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sel = new Date(formData.fecha);
      if (sel < today) return "La fecha no puede ser anterior a hoy.";
      return null;
    },
    hora: () => {
      if (!formData.hora) return "Selecciona la hora.";
      const parts = String(formData.hora).split(":").map(Number);
      if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return "Formato de hora inválido.";
      const minutes = parts[0] * 60 + parts[1];
      if (minutes < 8 * 60 || minutes > 17 * 60) return "La hora debe estar entre 08:00 y 17:00.";
      return null;
    },
    tipo: () => {
      return !formData.tipo ? "Selecciona el tipo de auditoría." : null;
    },
    descripcion: () => {
      const len = (formData.descripcion || "").trim().length;
      if (!len) return "La descripción es obligatoria.";
      if (len > 512) return "Máximo 512 caracteres.";
      return null;
    },
    auditorLider: () => {
      // Para internas, requerimos líder (si así lo quieres). Si prefieres opcional, cambia aquí.
      if ((String(formData.tipo || "").toLowerCase() !== "externa")) {
        return !formData.auditorLider ? "Selecciona un auditor líder." : null;
      }
      return null;
    }
  };

  // Función helper para obtener error y si mostrar (solo si touched)
  const getError = (field) => {
    if (!touched[field]) return null;

    const value = formData[field];

    // Verificar si el campo está vacío
    const isEmpty = () => {
      if (field === "auditoresAdicionales") {
        return !value || value.length === 0;
      }
      if (field === "procesoId") {
        return !value || value === "";
      }
      return !value || value.toString().trim() === "";
    };

    // Si el campo está vacío, mostrar mensaje de requerido
    if (isEmpty()) {
      return "Campo obligatorio";
    }

    // Si no está vacío, aplicar validaciones específicas
    const validator = validators[field];
    if (validator) {
      return validator();
    }

    return null;
  };

  // Al pulsar enviar: si hay errores, marcamos todos como touched y bloqueamos submit
  const handleSubmitWrapper = async () => {
    // Campos obligatorios basados en el tipo de auditoría
    const baseRequiredFields = [
      ...(Array.isArray(procesosCE) && procesosCE.length > 0
        ? ["procesoId"]
        : ["entidad", "proceso"]),
      "fecha",
      "hora",
      "tipo",
      "descripcion"
    ];

    // Para auditorías internas, agregar campos de auditores
    const allRequiredFields = formData.tipo?.toLowerCase() === "externa"
      ? baseRequiredFields
      : [...baseRequiredFields, "auditorLider"];

    // Marcar TODOS los campos obligatorios como touched
    const newTouched = {};
    allRequiredFields.forEach(field => {
      newTouched[field] = true;
    });

    setTouched(prev => ({ ...prev, ...newTouched }));

    // Verificar si hay ALGÚN campo obligatorio vacío
    const hasEmptyFields = allRequiredFields.some(field => {
      const value = formData[field];

      if (field === "auditoresAdicionales") {
        // Para arrays, verificar que no esté vacío (si es requerido)
        return !value || value.length === 0;
      }

      if (field === "procesoId") {
        return !value || value === "";
      }

      // Para otros campos, verificar que no estén vacíos
      return !value || value.toString().trim() === "";
    });

    // Si hay campos vacíos, llamar a onSubmit con hasErrors = true
    if (hasEmptyFields) {
      await onSubmit(true);
      return;
    }

    // Si no hay campos vacíos, proceder con envío normal
    await onSubmit(false);
  };

  // Helpers de labels con "*"
  const labelRequired = (label) => `${label}*`;

  // Computear algunos errores para mostrar en helperText
  const errorProcesoId = getError('procesoId');
  const errorEntidad = getError('entidad');
  const errorProceso = getError('proceso');
  const errorFecha = getError('fecha');
  const errorHora = getError('hora');
  const errorTipo = getError('tipo');
  const errorDescripcion = getError('descripcion');
  const errorLider = getError('auditorLider');

  const descripcionLength = formData.descripcion?.length || 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitleCustom
        title={isEditing ? "Editar Auditoría" : "Crear Auditoría"}
        subtitle=""
      />

      <DialogContent >
        <Box mb={2}>
          <Typography variant="subtitle2" color="primary" fontWeight={600} gutterBottom>
            Información General
          </Typography>

          <Grid container spacing={2}>
            {/* --- Entidad + Proceso (unificado con fallback) --- */}
            {Array.isArray(procesosCE) && procesosCE.length > 0 ? (
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" margin="dense" error={!!errorProcesoId}>
                  <InputLabel id="label-proceso-ce">{labelRequired("Entidad - Proceso")}</InputLabel>
                  <Select
                    labelId="label-proceso-ce"
                    id="select-proceso-ce"
                    name="procesoId"
                    value={formData.procesoId || ""}
                    onChange={(e) => {
                      // marcaremos touched a procesoId
                      handleLocalChange(e);
                      const value = e.target.value === "" ? "" : Number(e.target.value);
                      // la lógica original hacía varias llamadas a onChange; respetamos eso
                      // 1) procesoId
                      // 2) proceso (nombre)
                      // 3) entidad (nombreEntidad)
                      const sel = (procesosCE || []).find(p => Number(p.id) === Number(value));
                      // Notar: llamamos onChange con eventos sintéticos como antes
                      onChange({ target: { name: "procesoId", value } });
                      onChange({ target: { name: "proceso", value: sel?.nombreProceso || "" } });
                      onChange({ target: { name: "entidad", value: sel?.nombreEntidad || "" } });
                    }}
                    label="Entidad - Proceso"
                    aria-label="Selecciona entidad y proceso"
                  >
                    {procesosCE.map((p) => (
                      <MenuItem key={p.id} value={Number(p.id)}>
                        {p.nombre /* "Entidad X - Proceso Y" */}
                      </MenuItem>
                    ))}
                  </Select>
                  {errorProcesoId ? <Typography variant="caption" color="error">{errorProcesoId}</Typography> : null}
                </FormControl>
              </Grid>
            ) : (
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined" margin="dense" error={!!errorEntidad}>
                    <InputLabel id="label-entidad">{labelRequired("Entidad")}</InputLabel>
                    <Select
                      labelId="label-entidad"
                      id="select-entidad"
                      name="entidad"
                      value={formData.entidad}
                      onChange={(e) => {
                        handleLocalChange(e);
                        onEntidadChange?.(e.target.value);
                        // reset proceso + procesoId
                        onChange({ target: { name: "proceso", value: "" } });
                        onChange({ target: { name: "procesoId", value: "" } });
                      }}
                      label="Entidad"
                      aria-label="Selecciona la entidad"
                    >
                      {entidades.map((entidad, index) => (
                        <MenuItem key={index} value={entidad}>{entidad}</MenuItem>
                      ))}
                    </Select>
                    {errorEntidad ? <Typography variant="caption" color="error">{errorEntidad}</Typography> : null}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined" margin="dense" error={!!errorProceso}>
                    <InputLabel id="label-proceso">{labelRequired("Proceso")}</InputLabel>
                    <Select
                      labelId="label-proceso"
                      id="select-proceso"
                      name="proceso"
                      value={formData.proceso}
                      onChange={handleLocalChange}
                      label="Proceso"
                      aria-label="Selecciona el proceso"
                      disabled={!formData.entidad}
                    >
                      {procesos.map((proceso, index) => (
                        <MenuItem key={index} value={proceso}>{proceso}</MenuItem>
                      ))}
                    </Select>
                    {errorProceso ? <Typography variant="caption" color="error">{errorProceso}</Typography> : null}
                  </FormControl>
                </Grid>
              </>
            )}

            {/* Fecha */}
            <Grid item xs={12} md={6}>
              <TextField
                label={labelRequired("Fecha")}
                name="fecha"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.fecha}
                onChange={handleLocalChange}
                margin="dense"
                aria-label="Selecciona la fecha de auditoría"
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                error={!!errorFecha}
                helperText={errorFecha ?? ""}
              />
            </Grid>

            {/* Hora */}
            <Grid item xs={12} md={6}>
              {(() => {
                const horaStr = String(formData.hora || "");
                let timeInvalid = false;
                if (horaStr) {
                  const parts = horaStr.split(":").map(Number);
                  if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                    const minutesOfDay = parts[0] * 60 + parts[1];
                    timeInvalid = minutesOfDay < (8 * 60) || minutesOfDay > (17 * 60);
                  } else {
                    timeInvalid = true;
                  }
                }
                return (
                  <TextField
                    label={labelRequired("Hora")}
                    name="hora"
                    type="time"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={formData.hora}
                    onChange={handleLocalChange}
                    margin="dense"
                    aria-label="Selecciona la hora de auditoría"
                    inputProps={{
                      min: "08:00",
                      max: "17:00",
                      step: 900 // 15 minutos
                    }}
                    error={!!(timeInvalid || errorHora)}
                    helperText={errorHora ?? (timeInvalid ? "La hora debe estar entre 08:00 y 17:00." : "Selecciona una hora entre 08:00 y 17:00.")}
                  />
                );
              })()}
            </Grid>

            {/* Tipo */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense" error={!!errorTipo}>
                <InputLabel id="label-tipo">{labelRequired("Tipo de Auditoría")}</InputLabel>
                <Select
                  labelId="label-tipo"
                  id="select-tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={(e) => {
                    const nuevoTipo = e.target.value;
                    handleLocalChange(e);
                    if (nuevoTipo === "externa") {
                      // limpiar auditores si cambia a externa
                      onChange({ target: { name: "auditorLider", value: "" } });
                      onChange({ target: { name: "auditoresAdicionales", value: [] } });
                    }
                  }}
                  label="Tipo de Auditoría"
                  aria-label="Selecciona el tipo de auditoría"
                >
                  <MenuItem value="interna">Interna</MenuItem>
                  <MenuItem value="externa">Externa</MenuItem>
                </Select>
                {errorTipo ? <Typography variant="caption" color="error">{errorTipo}</Typography> : null}
              </FormControl>
            </Grid>

            {/* Estado (oculto en crear, visible en editar) */}
            <Grid item xs={12} md={6}>
              {isEditing ? (
                <FormControl fullWidth margin="dense">
                  <InputLabel id="label-estado">Estado</InputLabel>
                  <Select
                    labelId="label-estado"
                    id="select-estado"
                    name="estado"
                    value={(formData.estado || "pendiente").toLowerCase()}
                    onChange={handleLocalChange}
                    label="Estado"
                    aria-label="Selecciona el estado"
                  >
                    <MenuItem value="pendiente">Pendiente</MenuItem>
                    <MenuItem value="finalizada">Finalizada</MenuItem>
                    <MenuItem value="cancelada">Cancelada</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <Box sx={{ mt: 1.5 }}>
                  <InputLabel shrink sx={{ fontSize: 12, color: "text.secondary" }}>
                    Estado
                  </InputLabel>
                  <Typography variant="body2" color="text.secondary">
                    Estado inicial: <strong>Pendiente</strong>
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>

        {/* --- Auditores --- */}
        <Box mb={2}>
          <Typography variant="subtitle2" color="primary" fontWeight={600} gutterBottom>
            Auditores
          </Typography>

          {String(formData.tipo).toLowerCase() === "externa" ? (
            // Cuando la auditoría es EXTERNA, ocultamos los campos y mostramos una nota
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1,
                bgcolor: "action.hover",
                border: "1px dashed",
                borderColor: "divider",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Para auditorías <strong>externas</strong> no se asignan auditores internos.
              </Typography>
            </Box>
          ) : (
            // Para auditorías INTERNAS, mostramos los selects
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="dense" error={!!errorLider}>
                  <InputLabel id="label-auditor-lider">{labelRequired("Auditor Líder")}</InputLabel>
                  <Select
                    labelId="label-auditor-lider"
                    id="select-auditor-lider"
                    name="auditorLider"
                    value={formData.auditorLider ?? ""}
                    onChange={(e) => {
                      const v = e.target.value === "" ? "" : Number(e.target.value);

                      // set touched + set auditorLider
                      handleLocalChange({ target: { name: "auditorLider", value: v } });
                      onChange({ target: { name: "auditorLider", value: v } });

                      // QUITAR de adicionales si estaba seleccionado
                      if (v !== "" && Array.isArray(formData.auditoresAdicionales)) {
                        const cleaned = formData.auditoresAdicionales
                          .map(Number)
                          .filter((id) => id !== v);

                        if (cleaned.length !== formData.auditoresAdicionales.length) {
                          onChange({ target: { name: "auditoresAdicionales", value: cleaned } });
                        }
                      }
                    }}
                    label="Líder Auditor"
                    aria-label="Selecciona el líder auditor"
                  >
                    {auditores.map((auditor) => (
                      <MenuItem key={auditor.idUsuario} value={Number(auditor.idUsuario)}>
                        {[auditor.nombre, auditor.apellidoPat, auditor.apellidoMat].filter(Boolean).join(" ")}
                      </MenuItem>
                    ))}
                  </Select>
                  {errorLider ? <Typography variant="caption" color="error">{errorLider}</Typography> : null}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="label-auditores-adicionales">Auditores Adicionales</InputLabel>
                  <Select
                    labelId="label-auditores-adicionales"
                    id="select-auditores-adicionales"
                    multiple
                    name="auditoresAdicionales"
                    value={(formData.auditoresAdicionales || []).map(Number)}
                    onChange={(e) => {
                      const leader = Number(formData.auditorLider);
                      const arr = (e.target.value || [])
                        .map(Number)
                        .filter((id) => Number.isNaN(leader) ? true : id !== leader); // filtra líder

                      handleLocalChange({ target: { name: "auditoresAdicionales", value: arr } });
                      onChange({ target: { name: "auditoresAdicionales", value: arr } });
                    }}
                    label="Auditores Adicionales"
                    aria-label="Selecciona los auditores adicionales"
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((id) => {
                          const a = auditores.find((x) => Number(x.idUsuario) === Number(id));
                          return (
                            <Chip
                              key={id}
                              label={
                                a
                                  ? [a.nombre, a.apellidoPat, a.apellidoMat].filter(Boolean).join(" ")
                                  : `#${id}`
                              }
                              size="small"
                            />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {auditores
                      .filter((a) => Number(a.idUsuario) !== Number(formData.auditorLider))
                      .map((auditor) => (
                        <MenuItem key={auditor.idUsuario} value={Number(auditor.idUsuario)}>
                          <Checkbox
                            checked={(formData.auditoresAdicionales || [])
                              .map(Number)
                              .includes(Number(auditor.idUsuario))}
                          />
                          <ListItemText
                            primary={[auditor.nombre, auditor.apellidoPat, auditor.apellidoMat]
                              .filter((part) => part != null && part !== "")
                              .join(" ")}
                          />
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle2" color="primary" fontWeight={600} gutterBottom>
            Descripción
          </Typography>
          <TextField
            label={labelRequired("Descripción")}
            name="descripcion"
            fullWidth
            multiline
            rows={3}
            value={formData.descripcion}
            onChange={handleLocalChange}
            margin="dense"
            aria-label="Descripción de la auditoría"
            inputProps={{ maxLength: 512 }}
            error={!!errorDescripcion}
            helperText={errorDescripcion ?? `${descripcionLength}/512`}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <CustomButton type="cancelar" onClick={onClose} disabled={saving}>
          Cancelar
        </CustomButton>
        <CustomButton
          type="guardar"
          onClick={handleSubmitWrapper}
          disabled={saving}
          loading={saving}
        >
          {isEditing ? (saving ? "Guardando…" : "Guardar Cambios")
            : (saving ? "Guardando…" : "Agregar")}
        </CustomButton>
      </DialogActions>
    </Dialog >
  );
};

export default AuditoriaForm;
