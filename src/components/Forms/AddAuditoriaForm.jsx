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
  onEntidadChange
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
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" margin="dense">
                <InputLabel id="label-entidad">Entidad</InputLabel>
                <Select
                  labelId="label-entidad"
                  id="select-entidad"
                  name="entidad"
                  value={formData.entidad}
                  onChange={(e) => {
                    onChange(e); // actualiza formData
                    onEntidadChange?.(e.target.value); // actualiza procesos
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
                <InputLabel id="label-proceso"> Proceso</InputLabel>
                <Select
                  labelId="label-proceso"
                  id="select-proceso"
                  name="proceso"
                  value={formData.proceso}
                  onChange={onChange}
                  label="Proceso"
                  aria-label="Selecciona el proceso"
                >
                  {procesos.map((proceso, index) => (
                    <MenuItem key={index} value={proceso}>{proceso}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

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
                inputProps={{
                  min: new Date().toISOString().split('T')[0]
                }}

              />
            </Grid>

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
                    onChange(e); // actualiza tipo

                    // si el nuevo tipo es externa, limpiar auditores
                    if (nuevoTipo === "externa") {
                      onChange({ target: { name: "auditorLider", value: "" } });
                      onChange({ target: { name: "auditoresAdicionales", value: [] } });
                    }
                  }} label="Tipo de Auditoría"
                  aria-label="Selecciona el tipo de auditoría"
                >
                  <MenuItem value="interna">Interna</MenuItem>
                  <MenuItem value="externa">Externa</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="label-estado">Estado</InputLabel>
                <Select
                  labelId="label-estado"
                  id="select-estado"
                  name="estado"
                  value={formData.estado || "Pendiente"}
                  onChange={onChange}
                  label="Estado"
                  aria-label="Selecciona el estado"
                  disabled={!isEditing}
                >
                  <MenuItem value="Pendiente">Pendiente</MenuItem>
                  <MenuItem value="Finalizada">Finalizada</MenuItem>
                  <MenuItem value="Cancelada">Cancelada</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle2" color="primary" fontWeight={600} gutterBottom>
            Auditores
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="label-auditor-lider">Auditor Líder</InputLabel>
                <Select
                  labelId="label-auditor-lider"
                  id="select-auditor-lider"
                  name="auditorLider"
                  value={formData.auditorLider}
                  onChange={onChange}
                  label="Líder Auditor"
                  aria-label="Selecciona el líder auditor"
                  disabled={formData.tipo === "externa"}
                >
                  {auditores.map((auditor) => {
                    // Formatear el nombre para quitar los "null"
                    const nombreCompleto = [
                      auditor.nombre,
                      auditor.apellidoPat,
                      auditor.apellidoMat
                    ]
                      .filter(part => part !== null && part !== undefined && part !== '')
                      .join(' ');

                    return (
                      <MenuItem key={auditor.idUsuario} value={auditor.idUsuario}>
                        {nombreCompleto || 'Nombre no disponible'}
                      </MenuItem>
                    );
                  })}
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
                  value={formData.auditoresAdicionales || []}
                  onChange={onChange}
                  label="Auditores Adicionales"
                  aria-label="Selecciona los auditores adicionales"
                  disabled={formData.tipo === "externa"}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((id) => {
                        const auditor = auditores.find((a) => a.idUsuario === id);
                        return auditor ? (
                          <Chip
                            key={id}
                            label={`${auditor.nombre} ${auditor.apellidoPat}`}
                            size="small"
                          />
                        ) : null;
                      })}
                    </Box>
                  )}
                >
                  {auditores
                    .filter((a) => a.idUsuario !== formData.auditorLider)
                    .map((auditor) => (
                      <MenuItem key={auditor.idUsuario} value={auditor.idUsuario}>
                        <Checkbox
                          checked={(formData.auditoresAdicionales || []).includes(auditor.idUsuario)}
                        />
                        <ListItemText
                          primary={
                            [auditor.nombre, auditor.apellidoPat, auditor.apellidoMat]
                              .filter(part => part !== null && part !== undefined && part !== '')
                              .join(' ')
                          }
                        />
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
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
    </Dialog>
  );
};

export default AuditoriaForm;