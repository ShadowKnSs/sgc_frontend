import React, { useState } from "react";
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
  CircularProgress,
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
  loading = false,
  onEntidadChange,
  procesosCE = []
}) => {

  const [touched] = useState(false);

  const descripcionLength = formData.descripcion?.length || 0;
  const descripcionError = touched && descripcionLength === 0;
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
                <FormControl fullWidth variant="outlined" margin="dense">
                  <InputLabel id="label-proceso-ce">Entidad - Proceso</InputLabel>
                  <Select
                    labelId="label-proceso-ce"
                    id="select-proceso-ce"
                    name="procesoId"
                    value={formData.procesoId || ""}
                    onChange={(e) => {
                      const value = e.target.value === "" ? "" : Number(e.target.value);
                      onChange({ target: { name: "procesoId", value } });
                      const sel = (procesosCE || []).find(p => Number(p.id) === Number(value));
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
                </FormControl>
              </Grid>
            ) : (
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel id="label-entidad">Entidad</InputLabel>
                    <Select
                      labelId="label-entidad"
                      id="select-entidad"
                      name="entidad"
                      value={formData.entidad}
                      onChange={(e) => {
                        onChange(e);
                        onEntidadChange?.(e.target.value);
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
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel id="label-proceso">Proceso</InputLabel>
                    <Select
                      labelId="label-proceso"
                      id="select-proceso"
                      name="proceso"
                      value={formData.proceso}
                      onChange={onChange}
                      label="Proceso"
                      aria-label="Selecciona el proceso"
                      disabled={!formData.entidad}
                    >
                      {procesos.map((proceso, index) => (
                        <MenuItem key={index} value={proceso}>{proceso}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            {/* Fecha */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Fecha"
                name="fecha"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.fecha}
                onChange={onChange}
                margin="dense"
                aria-label="Selecciona la fecha de auditoría"
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
              />
            </Grid>

            {/* Hora */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Hora"
                name="hora"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.hora}
                onChange={onChange}
                margin="dense"
                aria-label="Selecciona la hora de auditoría"
              />
            </Grid>

            {/* Tipo */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="label-tipo">Tipo de Auditoría</InputLabel>
                <Select
                  labelId="label-tipo"
                  id="select-tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={(e) => {
                    const nuevoTipo = e.target.value;
                    onChange(e);
                    if (nuevoTipo === "externa") {
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
                    onChange={onChange}
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
                <FormControl fullWidth margin="dense">
                  <InputLabel id="label-auditor-lider">Auditor Líder</InputLabel>
                  <Select
                    labelId="label-auditor-lider"
                    id="select-auditor-lider"
                    name="auditorLider"
                    value={formData.auditorLider ?? ""}
                    onChange={(e) => {
                      const v = e.target.value === "" ? "" : Number(e.target.value);
                      onChange({ target: { name: "auditorLider", value: v } });
                    }}
                    label="Líder Auditor"
                    aria-label="Selecciona el líder auditor"
                  >
                    {auditores.map((auditor) => (
                      <MenuItem key={auditor.idUsuario} value={Number(auditor.idUsuario)}>
                        {[auditor.nombre, auditor.apellidoPat, auditor.apellidoMat]
                          .filter(Boolean)
                          .join(" ")}
                      </MenuItem>
                    ))}
                  </Select>
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
                      const arr = (e.target.value || []).map(Number);
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
            label="Descripción"
            name="descripcion"
            fullWidth
            multiline
            rows={3}
            value={formData.descripcion}
            onChange={onChange}
            margin="dense"
            aria-label="Descripción de la auditoría"
            inputProps={{ maxLength: 512 }}
            error={descripcionError}
            helperText={
              descripcionError
                ? "La descripción es obligatoria (máx. 512 caracteres)."
                : `${descripcionLength}/512`
            }
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <CustomButton type="cancelar" onClick={onClose} disabled={loading}>
          Cancelar
        </CustomButton>
        <CustomButton type="guardar" onClick={onSubmit} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : isEditing ? "Guardar Cambios" : "Agregar"}
        </CustomButton>
      </DialogActions>
    </Dialog >
  );
};

export default AuditoriaForm;