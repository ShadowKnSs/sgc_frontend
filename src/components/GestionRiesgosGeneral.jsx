// components/GestionRiesgosGeneral.jsx
import React from "react";
import {
  Paper, Box, Typography
} from "@mui/material";
import BusinessIcon from '@mui/icons-material/Business';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SettingsIcon from '@mui/icons-material/Settings';
import EditNoteIcon from '@mui/icons-material/EditNote';
import EventNoteIcon from '@mui/icons-material/EventNote';

const GestionRiesgosGeneral = ({ data, onChange, onSave, puedeEditar, modoEdicion, setModoEdicion, tieneGesRies }) => {
  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#0056b3" }}>
        Información General
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
        {/* ENTIDAD */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BusinessIcon color="primary" />
            <Typography variant="subtitle2" sx={{ color: "#68A2C9" }}>Entidad</Typography>
          </Box>
          <Typography variant="body1" sx={{ ml: 4 }}>{data.entidad || "Sin asignar"}</Typography>
        </Box>

        {/* MACROPROCESO */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccountTreeIcon color="primary" />
            <Typography variant="subtitle2" sx={{ color: "#68A2C9" }}>Macroproceso</Typography>
          </Box>
          <Typography variant="body1" sx={{ ml: 4 }}>{data.macroproceso || "Sin asignar"}</Typography>
        </Box>

        {/* PROCESO */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SettingsIcon color="primary" />
            <Typography variant="subtitle2" sx={{ color: "#68A2C9" }}>Proceso</Typography>
          </Box>
          <Typography variant="body1" sx={{ ml: 4 }}>{data.proceso || "Sin asignar"}</Typography>
        </Box>

        {/* FECHA AUTOMÁTICA */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EventNoteIcon color="primary" />
            <Typography variant="subtitle2" sx={{ color: "#68A2C9" }}>Fecha de elaboración</Typography>
          </Box>
          <Typography variant="body1" sx={{ ml: 4 }}>{data.fechaelaboracion}</Typography>
        </Box>

        {/* ELABORÓ (editable) */}
        <Box sx={{ display: "flex", flexDirection: "column", gridColumn: "1 / -1" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EditNoteIcon color="primary" />
            <Typography variant="subtitle2" sx={{ color: "#68A2C9" }}>Elaboró</Typography>
          </Box>
          <Typography variant="body1" sx={{ ml: 4 }}>{data.elaboro}</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default GestionRiesgosGeneral;
