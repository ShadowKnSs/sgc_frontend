import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Collapse } from "@mui/material";

const DetailsModal = ({ open, selectedRecord, records = [], handleCloseCardModal }) => {
  const [expandedRecords, setExpandedRecords] = useState({});

  const selectedIndex = records.findIndex(record => record === selectedRecord);

  useEffect(() => {
    if (selectedIndex !== -1) {
      setExpandedRecords({ [selectedIndex]: true });
    }
  }, [selectedIndex]);

  const toggleRecordDetails = (index) => {
    setExpandedRecords((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCloseCardModal} 
      fullWidth 
      maxWidth={false} // Hace que el modal ocupe todo el ancho posible
      sx={{
        "& .MuiDialog-paper": {
          width: "95vw",  // Ocupa el 95% del ancho de la pantalla
          height: "90vh", // Ocupa el 90% del alto de la pantalla
          maxWidth: "none", 
          maxHeight: "none", 
          display: "flex", 
          flexDirection: "column"
        }
      }}
    >
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', textAlign: 'center' }}>
        Detalles del Registro
      </DialogTitle>
      
      <DialogContent sx={{ flex: 1, overflowY: "auto" }}>
        <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
          {records.length > 0 ? (
            records.map((record, index) => (
              <Box
                key={index}
                sx={{
                  width: expandedRecords[index] ? 350 : 100,
                  height: expandedRecords[index] ? 400 : 150,
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2,
                  textAlign: 'center',
                  cursor: "pointer"
                }}
                onClick={() => toggleRecordDetails(index)}
              >
                <Typography variant="h6"><strong>{record.numero}</strong></Typography>

                <Collapse in={expandedRecords[index]}>
                  <Box
                    sx={{
                      mt: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      textAlign: 'center'
                    }}
                  >
                    <Typography><strong>Fuente:</strong> {record.fuente}</Typography>
                    <Typography><strong>Elemento Entrada:</strong> {record.elementoEntrada}</Typography>
                    <Typography><strong>Descripción:</strong> {record.descripcionActividad}</Typography>
                    <Typography><strong>Entregable:</strong> {record.entregable}</Typography>
                    <Typography><strong>Responsable:</strong> {record.responsable}</Typography>
                    <Typography><strong>Fecha Inicio:</strong> {record.fechaInicio}</Typography>
                    <Typography><strong>Fecha Término:</strong> {record.fechaTermino}</Typography>
                    <Typography><strong>Estado:</strong> {record.estado}</Typography>
                    <Button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        toggleRecordDetails(index); 
                      }} 
                      sx={{ 
                        mt: 2, 
                        textTransform: "none", 
                        color: "#1976d2",
                        "&:hover": { textDecoration: "underline" }
                      }}
                    >
                      Cerrar
                    </Button>
                  </Box>
                </Collapse>
              </Box>
            ))
          ) : (
            <Typography>No hay registros disponibles</Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end", p: 2 }}>
        <Button onClick={handleCloseCardModal} sx={{ color: "#1976d2", textTransform: "none" }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailsModal;
