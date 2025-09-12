import React, { useState } from "react";
import { Box, Grid, TextField, Typography, MenuItem } from "@mui/material";
import CustomButton from "./Button";
import FeedbackSnackbar from "./Feedback";

const InformeAudEquipo = ({
  equipoAuditor,
  setEquipoAuditor,
  auditoresDisponibles,
  personalAuditado,
  setPersonalAuditado,
}) => {
  const [snackbar, setSnackbar] = useState({ open: false, type: "info", title: "", message: "" });

  const showSnackbar = (type, title, message) =>
    setSnackbar({ open: true, type, title, message });

  const agregarAuditor = () => {
    // Validación: no agregar si hay un auditor nuevo vacío
    const ultimo = equipoAuditor[equipoAuditor.length - 1];
    if (ultimo && (!ultimo.rol || !ultimo.auditor)) {
      showSnackbar("error", "Error", "Por favor complete el último auditor antes de agregar otro.");
      return;
    }
    setEquipoAuditor([...equipoAuditor, { rol: "", auditor: "" }]);
  };

  const eliminarAuditor = (index) => {
    if (index === 0) {
      showSnackbar("error", "Error", "No se puede eliminar al auditor líder.");
      return;
    }
    setEquipoAuditor(equipoAuditor.filter((_, i) => i !== index));
  };

  const agregarPersonal = () => {
    const ultimo = personalAuditado[personalAuditado.length - 1];
    if (ultimo && (!ultimo.nombre || !ultimo.cargo)) {
      showSnackbar("error", "Error", "Por favor complete el último personal antes de agregar otro.");
      return;
    }
    setPersonalAuditado([...personalAuditado, { nombre: "", cargo: "" }]);
  };

  const eliminarPersonal = (index) => {
    if (personalAuditado.length <= 1) {
      showSnackbar("error", "Error", "Debe existir al menos un personal auditado.");
      return;
    }
    setPersonalAuditado(personalAuditado.filter((_, i) => i !== index));
  };

  return (
    <Box mt={3}>
      <Grid container spacing={4}>
        {/* EQUIPO AUDITOR */}
        <Grid item xs={6}>
          <Typography variant="body1" gutterBottom>
            <strong>Equipo Auditor:</strong>
          </Typography>

          {/* Auditor líder fijo */}
          {equipoAuditor.length > 0 && (
            <Box mt={1} mb={2}>
              <TextField
                fullWidth
                label="Rol"
                variant="outlined"
                value={equipoAuditor[0].rol}
                disabled
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                label="Nombre Auditor"
                variant="outlined"
                value={equipoAuditor[0].auditor}
                disabled
              />
            </Box>
          )}

          {/* Resto del equipo */}
          {equipoAuditor.slice(1).map((item, index) => (
            <Box key={index + 1} mt={1}>
              <TextField
                fullWidth
                label="Rol"
                variant="outlined"
                value={item.rol}
                onChange={(e) => {
                  const nuevos = [...equipoAuditor];
                  nuevos[index + 1].rol = e.target.value;
                  setEquipoAuditor(nuevos);
                }}
                sx={{ mb: 1 }}
              />
              <TextField
                select
                fullWidth
                label="Nombre Auditor"
                variant="outlined"
                value={item.auditor}
                onChange={(e) => {
                  const nuevos = [...equipoAuditor];
                  nuevos[index + 1].auditor = e.target.value;
                  setEquipoAuditor(nuevos);
                }}
                sx={{ mb: 1 }}
              >
                {auditoresDisponibles.map((auditor) => (
                  <MenuItem
                    key={auditor.idUsuario}
                    value={`${auditor.nombre} ${auditor.apellidoPat} ${auditor.apellidoMat}`}
                  >
                    {`${auditor.nombre} ${auditor.apellidoPat} ${auditor.apellidoMat}`}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          ))}

          {/* Botón agregar y eliminar debajo */}
          <Box display="flex" justifyContent="flex-end" mb={2}>
            {equipoAuditor.length > 1 && (
              <CustomButton
                type="cancelar"
                sx={{ mr: 1 }}
                onClick={() => eliminarAuditor(equipoAuditor.length - 1)}
              >
                Eliminar Último
              </CustomButton>
            )}
            <CustomButton color="primary" onClick={agregarAuditor}>
              Agregar Auditor
            </CustomButton>
          </Box>
        </Grid>

        {/* PERSONAL AUDITADO */}
        <Grid item xs={6}>
          <Typography variant="body1" gutterBottom>
            <strong>Personal Auditado:</strong>
          </Typography>

          {personalAuditado.map((item, index) => (
            <Box key={index} mt={1}>
              <TextField
                fullWidth
                multiline
                minRows={1}
                maxRows={3}
                label="Nombre"
                variant="outlined"
                value={item.nombre}
                onChange={(e) => {
                  const nuevos = [...personalAuditado];
                  nuevos[index].nombre = e.target.value;
                  setPersonalAuditado(nuevos);
                }}
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                multiline
                minRows={1}
                maxRows={3}
                label="Cargo"
                variant="outlined"
                value={item.cargo}
                onChange={(e) => {
                  const nuevos = [...personalAuditado];
                  nuevos[index].cargo = e.target.value;
                  setPersonalAuditado(nuevos);
                }}
                sx={{ mb: 1 }}
              />
            </Box>
          ))}

          {/* Botones debajo */}
          <Box display="flex" justifyContent="flex-end" mb={2}>
            {personalAuditado.length > 1 && (
              <CustomButton
                type="cancelar"
                sx={{ mr: 1 }}
                onClick={() => eliminarPersonal(personalAuditado.length - 1)}
              >
                Eliminar Último
              </CustomButton>
            )}
            <CustomButton color="primary" onClick={agregarPersonal}>
              Agregar
            </CustomButton>
          </Box>
        </Grid>
      </Grid>

      {/* Feedback */}
      <FeedbackSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        type={snackbar.type}
        title={snackbar.title}
        message={snackbar.message}
      />
    </Box>
  );
};

export default InformeAudEquipo;
