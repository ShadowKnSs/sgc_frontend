import React from "react";
import { Dialog, DialogTitle, DialogContent, Typography, Divider, Box } from "@mui/material";

const DetalleProyectoModal = ({ open, onClose, proyecto }) => {
  if (!proyecto) return null;

  const renderSeccion = (titulo, contenido) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" fontWeight="bold">{titulo}</Typography>
      {contenido}
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Proyecto de Mejora #{proyecto.noMejora}</DialogTitle>
      <DialogContent dividers>
        {renderSeccion("División", <Typography>{proyecto.division}</Typography>)}
        {renderSeccion("Departamento", <Typography>{proyecto.departamento}</Typography>)}
        {renderSeccion("Fecha", <Typography>{proyecto.fecha}</Typography>)}
        {renderSeccion("Responsable", <Typography>{proyecto.responsable}</Typography>)}
        {renderSeccion("Descripción de la Mejora", <Typography>{proyecto.descripcionMejora}</Typography>)}
        {renderSeccion("Área de Impacto", <Typography>{proyecto.areaImpacto}</Typography>)}
        {renderSeccion("Personal Beneficiado", <Typography>{proyecto.personalBeneficiado}</Typography>)}
        {renderSeccion("Situación Actual", <Typography>{proyecto.situacionActual}</Typography>)}

        <Divider sx={{ my: 2 }} />

        {renderSeccion("Objetivos", (proyecto.objetivos || []).map((o, i) => (
          <Typography key={i}>• {o.descripcionObj}</Typography>
        )))}

        {renderSeccion("Responsables", (proyecto.responsablesInv || []).map((r, i) => (
          <Typography key={i}>• {r.nombre}</Typography>
        )))}

        {renderSeccion("Indicadores de Éxito", (proyecto.indicadoresExito || []).map((i, idx) => (
          <Typography key={idx}>• {i.nombreInd} - Meta: {i.meta ?? "No definida"}</Typography>
        )))}

        {renderSeccion("Recursos", (proyecto.recursos || []).map((r, i) => (
          <Typography key={i}>• {r.tiempoEstimado} - {r.recursosMatHum}</Typography>
        )))}

        {renderSeccion("Actividades / Plan de Trabajo", (proyecto.actividades || []).map((a, i) => (
          <Typography key={i}>• {a.descripcionAct} - {a.responsable} - {a.fecha}</Typography>
        )))}

        <Divider sx={{ my: 2 }} />

        {renderSeccion("Aprobación", (
          <Typography>
            {proyecto.aprobacionNombre} ({proyecto.aprobacionPuesto})
          </Typography>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default DetalleProyectoModal;
