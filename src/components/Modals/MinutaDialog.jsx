import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, Card, CardContent, CardHeader, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { styled } from '@mui/system';

const MinutaDialog = ({ open, onClose, minuta, onEdit, onDelete, soloLectura }) => {
  console.log("minuta Dialog", minuta);
  if (!minuta) return null;

  const handleEdit = () => {
    onEdit(minuta);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ backgroundColor: '#004A98', color: 'white', fontWeight: 'bold' }}>
        Detalles de la Minuta
      </DialogTitle>

      <DialogContent dividers sx={{ paddingTop: 2 }}>
        {/* Contenedor principal para la minuta */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Card para los detalles generales */}
          <Card variant="outlined" sx={{ padding: 2, backgroundColor: '#E8E8E8' }}>
            <CardHeader title="Detalles Generales" sx={{ backgroundColor: '#F1F1F1', color: '#004A98' }} />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Fecha: </Typography>
                  <Typography variant="body1">{minuta.fecha || 'No especificado'}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Lugar: </Typography>
                  <Typography variant="body1">{minuta.lugar || 'No especificado'}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Duración: </Typography>
                  <Typography variant="body1">{minuta.duracion ? `${minuta.duracion} minutos` : 'No especificado'}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Card para actividades */}
          <Card variant="outlined" sx={{ padding: 2 }}>
            <CardHeader title="Actividades" sx={{ backgroundColor: '#F1F1F1', color: '#004A98' }} />
            <CardContent>
              {minuta.actividades && minuta.actividades.length > 0 ? (
                minuta.actividades.map((act, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Actividad {index + 1}:</Typography>
                    <Typography variant="body1" sx={{ ml: 2 }}>{act.descripcion}</Typography>
                  </Box>
                ))
              ) : (
                <Typography color="textSecondary" variant="body1">No hay actividades registradas</Typography>
              )}
            </CardContent>
          </Card>

          {/* Card para los asistentes */}
          <Card variant="outlined" sx={{ padding: 2 }}>
            <CardHeader title="Asistentes" sx={{ backgroundColor: '#F1F1F1', color: '#1004A98' }} />
            <CardContent>
              {minuta.asistentes && minuta.asistentes.length > 0 ? (
                minuta.asistentes.map((asistente, index) => (
                  <Typography key={index} variant="body1">{asistente.nombre || 'No especificado'}</Typography>
                ))
              ) : (
                <Typography color="textSecondary" variant="body1">No hay asistentes registrados</Typography>
              )}
            </CardContent>
          </Card>

          {/* Card para los compromisos con tabla */}
          <Card variant="outlined" sx={{ padding: 2, backgroundColor: '#E8E8E8' }}>
            <CardHeader title="Compromisos" sx={{ backgroundColor: '#F1F1F1', color: '#004A98' }} />
            <CardContent>
              {minuta.compromisos && minuta.compromisos.length > 0 ? (
                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ backgroundColor: '#F9B800', color: '#1B3156' }}>Descripción</TableCell>
                        <TableCell sx={{ backgroundColor: '#F9B800', color: '#1B3156' }}>Responsable</TableCell>
                        <TableCell sx={{ backgroundColor: '#F9B800', color: '#1B3156' }}>Fecha</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {minuta.compromisos.map((compromiso, index) => (
                        <TableRow key={index}>
                          <TableCell>{compromiso.descripcion}</TableCell>
                          <TableCell>{compromiso.responsables || 'No asignado'}</TableCell>
                          <TableCell>{compromiso.fecha || 'No especificada'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="textSecondary" variant="body1">No hay compromisos registrados</Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: '16px 24px', backgroundColor: '#E8E8E8' }}>
        <Grid container justifyContent="space-between">
          <Grid item>
            {!soloLectura && (
              <>
                <Button onClick={handleEdit} color="primary" variant="outlined" sx={{ marginRight: 2 }}>
                  Editar
                </Button>
                <Button onClick={() => onDelete(minuta.idSeguimiento)} color="error" variant="outlined">
                  Eliminar
                </Button>
              </>
            )}
          </Grid>
          <Grid item>
            <Button onClick={onClose} color="primary" variant="contained" sx={{ backgroundColor: '#00B2E3' }}>
              Cerrar
            </Button>
          </Grid>
        </Grid>
      </DialogActions>

    </Dialog>
  );
};

export default MinutaDialog;
