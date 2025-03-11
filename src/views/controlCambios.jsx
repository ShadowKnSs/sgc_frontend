import React, { useState } from "react";
import {
  Box, Fab, Card, CardContent, Typography, 
  Table, TableBody, TableCell, TableContainer, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";

const ControlCambios = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [newRow, setNewRow] = useState({ seccion: "", edicion: "", version: "", fechaRevision: "", descripcion: "" });
  const [data, setData] = useState([
    { seccion: "Introducción", edicion: 1, version: 2, fechaRevision: "2024-03-10 10:00:00", descripcion: "Corrección de gramática y formato" }
  ]);
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    let tempErrors = {};
    if (!newRow.seccion.trim()) tempErrors.seccion = "Este campo es obligatorio";
    if (!newRow.descripcion.trim()) tempErrors.descripcion = "Este campo es obligatorio";
    if (!newRow.fechaRevision) tempErrors.fechaRevision = "Debe seleccionar una fecha";

    if (!newRow.edicion || isNaN(newRow.edicion) || parseInt(newRow.edicion) <= 0) {
      tempErrors.edicion = "Debe ser un número mayor a 0";
    }
    if (!newRow.version || isNaN(newRow.version) || parseInt(newRow.version) <= 0) {
      tempErrors.version = "Debe ser un número mayor a 0";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleAddRow = () => {
    if (validateFields()) {
      setData([...data, { ...newRow, edicion: parseInt(newRow.edicion), version: parseInt(newRow.version) }]);
      setNewRow({ seccion: "", edicion: "", version: "", fechaRevision: "", descripcion: "" });
      setErrors({});
      setOpenDialog(false);
    }
  };

  return (
    <Box sx={{ width: "80%", margin: "auto", mt: 1 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", color: "#0056b3", mb: 2 }}>
        CONTROL DE CAMBIOS
      </Typography>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Table>
              <TableBody>
                <TableRow sx={{ bgcolor: "#0056b3", color: "white" }}>
                  <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>SECCIÓN</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>EDICIÓN</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>VERSIÓN</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>FECHA DE REVISIÓN</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>DESCRIPCIÓN</TableCell>
                </TableRow>
                {data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{row.seccion}</TableCell>
                    <TableCell align="center">{row.edicion}</TableCell>
                    <TableCell align="center">{row.version}</TableCell>
                    <TableCell align="center">{row.fechaRevision}</TableCell>
                    <TableCell align="center">{row.descripcion}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <Fab sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'primary.main' } }} onClick={() => setOpenDialog(true)}>
          <Add sx={{ color: 'white' }} />
        </Fab>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle sx={{ fontWeight: "bold", color: "#0056b3" }}>Agregar nueva versión</DialogTitle>
        <DialogContent>
          <TextField 
            label="Sección"
            fullWidth
            variant="outlined"
            sx={{ mb: 2, backgroundColor: "white" }}
            value={newRow.seccion}
            onChange={(e) => setNewRow({ ...newRow, seccion: e.target.value })}
            error={!!errors.seccion}
            helperText={errors.seccion}
          />
          <TextField 
            label="Edición"
            type="number"
            fullWidth
            variant="outlined"
            sx={{ mb: 2, backgroundColor: "white" }}
            value={newRow.edicion}
            onChange={(e) => setNewRow({ ...newRow, edicion: e.target.value })}
            error={!!errors.edicion}
            helperText={errors.edicion}
          />
          <TextField 
            label="Versión"
            type="number"
            fullWidth
            variant="outlined"
            sx={{ mb: 2, backgroundColor: "white" }}
            value={newRow.version}
            onChange={(e) => setNewRow({ ...newRow, version: e.target.value })}
            error={!!errors.version}
            helperText={errors.version}
          />
          <TextField 
            label="Fecha de Revisión" 
            type="datetime-local" 
            InputLabelProps={{ shrink: true }}
            fullWidth
            variant="outlined"
            sx={{ mb: 2, backgroundColor: "white" }}
            value={newRow.fechaRevision}
            onChange={(e) => setNewRow({ ...newRow, fechaRevision: e.target.value })}
            error={!!errors.fechaRevision}
            helperText={errors.fechaRevision}
          />
          <TextField 
            label="Descripción"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            sx={{ mb: 2, backgroundColor: "white" }}
            value={newRow.descripcion}
            onChange={(e) => setNewRow({ ...newRow, descripcion: e.target.value })}
            error={!!errors.descripcion}
            helperText={errors.descripcion}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ bgcolor: "#D3D3D3", color: "black", '&:hover': { bgcolor: "#B0B0B0" } }}>CANCELAR</Button>
          <Button onClick={handleAddRow} sx={{ bgcolor: "#F9B800", color: "black", '&:hover': { bgcolor: "#E0A500" } }}>GUARDAR</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ControlCambios;
