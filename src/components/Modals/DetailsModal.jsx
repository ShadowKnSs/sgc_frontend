import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Typography, Box, Collapse, Grid, Divider
} from "@mui/material";

const DetailsModal = ({ open, selectedRecord, records = [], handleCloseCardModal }) => {
  const [expandedRecords, setExpandedRecords] = useState({});
  const selectedIndex = records.findIndex(record => record === selectedRecord);

  useEffect(() => {
    if (selectedIndex !== -1) {
      setExpandedRecords({ [selectedIndex]: true });
    }
  }, [selectedIndex]);

  const toggleRecordDetails = (index) => {
    setExpandedRecords(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseCardModal}
      fullWidth
      maxWidth="xl"
      sx={{
        "& .MuiDialog-paper": {
          width: "95vw",
          height: "90vh",
          maxWidth: "none",
          display: "flex",
          flexDirection: "column"
        }
      }}
    >
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', textAlign: 'center' }}>
        Detalles de las Fuentes
      </DialogTitle>

      <DialogContent sx={{ flex: 1, overflowY: "auto", px: 4 }}>
        <Grid container spacing={3} justifyContent="center">
          {records.length > 0 ? records.map((record, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  bgcolor: "background.paper",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.01)"
                  },
                  cursor: "pointer"
                }}
                onClick={() => toggleRecordDetails(index)}
              >
                <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: "12px 12px 0 0" }}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Actividad #{record.numero}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" noWrap title={record.nombreFuente}>
                    {record.nombreFuente}
                  </Typography>
                </Box>

                <Collapse in={expandedRecords[index]}>
                  <Divider />
                  <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography><strong>Elemento de Entrada:</strong> {record.elementoEntrada}</Typography>
                    <Typography><strong>Descripción:</strong> {record.descripcion}</Typography>
                    <Typography><strong>Entregable:</strong> {record.entregable}</Typography>
                    <Typography><strong>Responsable:</strong> {record.responsable}</Typography>
                    <Typography><strong>Fecha de Inicio:</strong> {record.fechaInicio}</Typography>
                    <Typography><strong>Fecha de Término:</strong> {record.fechaTermino}</Typography>
                    <Typography><strong>Estado:</strong> {record.estado}</Typography>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRecordDetails(index);
                      }}
                      size="small"
                      sx={{
                        mt: 1,
                        alignSelf: "flex-start",
                        color: "primary.main",
                        textTransform: "none",
                        "&:hover": { textDecoration: "underline" }
                      }}
                    >
                      Ocultar detalles
                    </Button>
                  </Box>
                </Collapse>
              </Box>
            </Grid>
          )) : (
            <Typography>No hay registros disponibles</Typography>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end", p: 2 }}>
        <Button onClick={handleCloseCardModal} sx={{ color: "primary.main", textTransform: "none" }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailsModal;
