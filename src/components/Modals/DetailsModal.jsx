import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Collapse, IconButton } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

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
    <Dialog open={open} onClose={handleCloseCardModal} fullWidth maxWidth="md">
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>Detalles del Registro</DialogTitle>
      <DialogContent>
        <Box>
          {records.length > 0 ? (
            records.map((record, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  mb: 2,
                  boxShadow: 3,
                  width: expandedRecords[index] ? '100%' : '50%',
                  transition: 'width 0.3s ease',
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6"><strong>Número:</strong> {record.numero}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => toggleRecordDetails(index)}
                  >
                    {expandedRecords[index] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>

                <Collapse in={expandedRecords[index]}>
                  <Box
                    sx={{
                      mt: 2,
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 2,
                      bgcolor: "grey.100",
                      borderRadius: 1,
                      p: 2,
                    }}
                  >
                    <Box flex={1}>
                      <Typography><strong>Fuente:</strong> {record.fuente}</Typography>
                      <Typography><strong>Elemento Entrada:</strong> {record.elementoEntrada}</Typography>
                      <Typography><strong>Descripción Actividad:</strong> {record.descripcionActividad}</Typography>
                    </Box>
                    <Box flex={1}>
                      <Typography><strong>Entregable:</strong> {record.entregable}</Typography>
                      <Typography><strong>Responsable:</strong> {record.responsable}</Typography>
                      <Typography><strong>Fecha Inicio:</strong> {record.fechaInicio}</Typography>
                    </Box>
                    <Box flex={1}>
                      <Typography><strong>Fecha Término:</strong> {record.fechaTermino}</Typography>
                      <Typography><strong>Estado:</strong> {record.estado}</Typography>
                    </Box>
                  </Box>
                </Collapse>
              </Box>
            ))
          ) : (
            <Typography>No hay registros disponibles</Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseCardModal} color="primary" variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailsModal;