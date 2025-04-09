import React, { useState, useEffect } from "react";
import axios from "axios";
import { IconButton, Box, Fab, Card, CardContent, Typography, 
  Table, TableBody, TableCell, TableContainer, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";

const ControlCambios = ({ soloLectura }) => {
  
  const [openDialog, setOpenDialog] = useState(false);
  const [newRow, setNewRow] = useState({ seccion: "", edicion: "", version: "", fechaRevision: "", descripcion: "" });
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/controlcambios");
        setData(response.data);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
    fetchData();
  }, []);  

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

  const handleAddRow = async () => {
    if (soloLectura) return;
    if (validateFields()) {
      try {
        if (newRow.idCambio) {
          await axios.put(`http://localhost:8000/api/controlcambios/${newRow.idCambio}`, {
            seccion: newRow.seccion,
            edicion: parseInt(newRow.edicion),
            version: parseInt(newRow.version),
            fechaRevision: newRow.fechaRevision,
            descripcion: newRow.descripcion
          });
          setData(data.map(item => (item.idCambio === newRow.idCambio ? newRow : item)));
        } else {
          const response = await axios.post("http://localhost:8000/api/controlcambios", {
            idProceso: 1,
            idArchivo: 1,
            seccion: newRow.seccion,
            edicion: parseInt(newRow.edicion),
            version: parseInt(newRow.version),
            fechaRevision: newRow.fechaRevision,
            descripcion: newRow.descripcion
          });
          setData([...data, response.data]);
        }

        setNewRow({ seccion: "", edicion: "", version: "", fechaRevision: "", descripcion: "" });
        setErrors({});
        setOpenDialog(false);
        
      } catch (error) {
        console.error("Error al guardar en la base de datos:", error.response?.data || error);
      }
    }
  };

  const handleEdit = (item) => {
    if (soloLectura) return;
    setNewRow({ 
      idCambio: item.idCambio,
      seccion: item.seccion,
      edicion: item.edicion,
      version: item.version,
      fechaRevision: item.fechaRevision,
      descripcion: item.descripcion
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (soloLectura) return;
    if (window.confirm("¿Seguro que deseas eliminar este registro?")) {
      try {
        await axios.delete(`http://localhost:8000/api/controlcambios/${id}`);
        setData(data.filter((item) => item.idCambio !== id));
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
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
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}></TableCell> 
              </TableRow>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{row.seccion}</TableCell>
                  <TableCell align="center">{row.edicion}</TableCell>
                  <TableCell align="center">{row.version}</TableCell>
                  <TableCell align="center">{row.fechaRevision}</TableCell>
                  <TableCell align="center">{row.descripcion}</TableCell>
                  <TableCell align="center">
                    {!soloLectura && (
                      <>
                        <IconButton onClick={() => handleEdit(row)} sx={{ color: "#0056b3", "&:hover": { color: "#003f80" } }}>
                          <Edit sx={{ fontSize: 24 }} />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(row.idCambio)} sx={{ color: "#F9B800", "&:hover": { color: "#E0A500" }, ml: 1 }}>
                          <Delete sx={{ fontSize: 24 }} />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {!soloLectura && (
        <Box sx={{ position: "fixed", bottom: 16, right: 70, paddingRight: 0 }}>
          <Fab sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'primary.main' } }} onClick={() => setOpenDialog(true)}>
            <Add sx={{ color: 'white' }} />
          </Fab>
        </Box>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle sx={{ fontWeight: "bold", color: "#0056b3" }}>
          {newRow.idCambio ? "Editar versión" : "Agregar nueva versión"}
        </DialogTitle>
        <DialogContent>
          <TextField 
            label="Sección" fullWidth variant="outlined" sx={{ mb: 2, backgroundColor: "white" }}
            value={newRow.seccion} disabled={soloLectura}
            onChange={(e) => setNewRow({ ...newRow, seccion: e.target.value })}
            error={!!errors.seccion} helperText={errors.seccion}
          />
          <TextField 
            label="Edición" type="number" fullWidth variant="outlined" sx={{ mb: 2, backgroundColor: "white" }}
            value={newRow.edicion} disabled={soloLectura}
            onChange={(e) => setNewRow({ ...newRow, edicion: e.target.value })}
            error={!!errors.edicion} helperText={errors.edicion}
            inputProps={{ min: 0 }}
          />
          <TextField 
            label="Versión" type="number" fullWidth variant="outlined" sx={{ mb: 2, backgroundColor: "white" }}
            value={newRow.version} disabled={soloLectura}
            onChange={(e) => setNewRow({ ...newRow, version: e.target.value })}
            error={!!errors.version} helperText={errors.version}
            inputProps={{ min: 0 }}
          />
          <TextField 
            label="Fecha de Revisión" type="datetime-local" InputLabelProps={{ shrink: true }}
            fullWidth variant="outlined" sx={{ mb: 2, backgroundColor: "white" }}
            value={newRow.fechaRevision} disabled={soloLectura}
            onChange={(e) => setNewRow({ ...newRow, fechaRevision: e.target.value })}
            error={!!errors.fechaRevision} helperText={errors.fechaRevision}
          />
          <TextField 
            label="Descripción" multiline rows={3} fullWidth variant="outlined" sx={{ mb: 2, backgroundColor: "white" }}
            value={newRow.descripcion} disabled={soloLectura}
            onChange={(e) => setNewRow({ ...newRow, descripcion: e.target.value })}
            error={!!errors.descripcion} helperText={errors.descripcion}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ bgcolor: "#D3D3D3", color: "black", '&:hover': { bgcolor: "#B0B0B0" } }}>
            CANCELAR
          </Button>
          {!soloLectura && (
            <Button onClick={handleAddRow} sx={{ bgcolor: "#F9B800", color: "black", '&:hover': { bgcolor: "#E0A500" } }}>
              GUARDAR
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ControlCambios;
