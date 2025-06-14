import React from "react";
import {
  Dialog,
  DialogContent,
  Divider,
  Box,
  Typography,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import {
  Assignment,
  People,
  CheckCircle,
  EventNote,
  Group,
  Insights,
  Build,
  ListAlt,
  VerifiedUser,
  ChevronRight
} from "@mui/icons-material";
import DialogTitleCustom from "../TitleDialog";
import CustomButton from "../Button";

const DetalleProyectoModal = ({ open, onClose, proyecto }) => {
  if (!proyecto) return null;
  console.log(proyecto);


 const renderSeccion = (titulo, contenido, Icono) => {
    const bgColor = "#fff"; // color marfil
    return (
      <Box sx={{ mb: 3, borderRadius: 2, backgroundColor: bgColor, px: 2, py: 2 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: "#185FA4" }}>
          {Icono && <Icono sx={{ verticalAlign: "middle", mr: 1 }} />} {titulo}
        </Typography>
        <Box sx={{ pl: 3 }}>{contenido}</Box>
      </Box>
    );
  };

  const renderList = (items) => (
    <List dense>
      {items.map((text, i) => (
        <ListItem key={i} disablePadding>
          <ListItemIcon><ChevronRight fontSize="small" /></ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      ))}
    </List>
  );

  const handleDescargarPDF = () => {
    const url = `http://localhost:8000/api/reporte-proyecto-mejora/${proyecto.idProyectoMejora}`;
    window.open(url, "_blank");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitleCustom title={`Proyecto de Mejora #${proyecto.noMejora}`} subtitle="Detalles completos del proyecto de mejora" />

      <DialogContent dividers sx={{ backgroundColor: "#f9f9f9", pt: 3 }}>
        {renderSeccion("Información General", (
          <>
            <Typography><strong>División:</strong> {proyecto.division}</Typography>
            <Typography><strong>Departamento:</strong> {proyecto.departamento}</Typography>
            <Typography><strong>Fecha:</strong> {proyecto.fecha}</Typography>
            <Typography><strong>Responsable:</strong> {proyecto.responsable}</Typography>
          </>
        ), Assignment)}

        <Divider sx={{ my: 2 }} />

        {renderSeccion("Descripción de la Mejora", <Typography>{proyecto.descripcionMejora}</Typography>, EventNote)}
        {renderSeccion("Área de Impacto", <Typography>{proyecto.areaImpacto}</Typography>, Group)}
        {renderSeccion("Personal Beneficiado", <Typography>{proyecto.personalBeneficiado}</Typography>, Group)}
        {renderSeccion("Situación Actual", <Typography>{proyecto.situacionActual}</Typography>, EventNote)}

        <Divider sx={{ my: 2 }} />

        {renderSeccion("Objetivos", renderList((proyecto.objetivos || []).map(o => o.descripcionObj)), CheckCircle)}
        {renderSeccion("Responsables", renderList((proyecto.responsables_inv || []).map(r => r.nombre)), People)}
        {renderSeccion("Indicadores de Éxito", renderList((proyecto.indicadores_exito || []).map(i => `${i.nombreInd} — Meta: ${i.meta ?? "No definida"}`)), Insights)}
        {renderSeccion("Recursos", (
          <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
            <Box component="thead">
              <Box component="tr" sx={{ backgroundColor: "#E3EBDA" }}>
                <Box component="th" sx={{ border: "1px solid #ccc", p: 1, textAlign: "left" }}>Tiempo Estimado</Box>
                <Box component="th" sx={{ border: "1px solid #ccc", p: 1, textAlign: "left" }}>Recursos Materiales y Humanos</Box>
                <Box component="th" sx={{ border: "1px solid #ccc", p: 1, textAlign: "left" }}>Costo</Box>
              </Box>
            </Box>
            <Box component="tbody">
              {(proyecto.recursos || []).map((r, i) => (
                <Box component="tr" key={i}>
                  <Box component="td" sx={{ border: "1px solid #ccc", p: 1 }}>{r.tiempoEstimado}</Box>
                  <Box component="td" sx={{ border: "1px solid #ccc", p: 1 }}>{r.recursosMatHum}</Box>
                  <Box component="td" sx={{ border: "1px solid #ccc", p: 1 }}>
                    {r.costo !== null && r.costo !== undefined ? `$${r.costo}` : "No definido"}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ), Build)}

        {renderSeccion("Actividades / Plan de Trabajo", (
          <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
            <Box component="thead">
              <Box component="tr" sx={{ backgroundColor: "#DFECDF" }}>
                <Box component="th" sx={{ border: "1px solid #ccc", p: 1, textAlign: "left" }}>Actividad</Box>
                <Box component="th" sx={{ border: "1px solid #ccc", p: 1, textAlign: "left" }}>Responsable</Box>
                <Box component="th" sx={{ border: "1px solid #ccc", p: 1, textAlign: "left" }}>Fecha</Box>
              </Box>
            </Box>
            <Box component="tbody">
              {(proyecto.actividades || []).map((a, i) => (
                <Box component="tr" key={i}>
                  <Box component="td" sx={{ border: "1px solid #ccc", p: 1 }}>{a.descripcionAct}</Box>
                  <Box component="td" sx={{ border: "1px solid #ccc", p: 1 }}>{a.responsable}</Box>
                  <Box component="td" sx={{ border: "1px solid #ccc", p: 1 }}>{a.fecha}</Box>
                </Box>
              ))}
            </Box>
          </Box>
        ), ListAlt)}

        <Divider sx={{ my: 2 }} />

        {renderSeccion("Aprobación", (
          <Typography>{proyecto.aprobacionNombre} ({proyecto.aprobacionPuesto})</Typography>
        ), VerifiedUser)}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
        <CustomButton type="descargar" onClick={handleDescargarPDF}>
          Descargar PDF
        </CustomButton>
        <CustomButton type="cancelar" onClick={onClose}>
          Cerrar
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default DetalleProyectoModal;
