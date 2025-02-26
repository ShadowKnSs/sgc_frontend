import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Stack } from "@mui/material";

const DetailsModal = ({ selectedRecord, handleCloseCardModal }) => {
  return (
    <Dialog open={Boolean(selectedRecord)} onClose={handleCloseCardModal} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
        Detalles del Registro
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {selectedRecord && (
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Número:</Typography>
              <Typography variant="body1">{selectedRecord.numero}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Fuente:</Typography>
              <Typography variant="body1">{selectedRecord.fuente}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Elemento Entrada:</Typography>
              <Typography variant="body1">{selectedRecord.elementoEntrada}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Descripción Actividad:</Typography>
              <Typography variant="body1">{selectedRecord.descripcionActividad}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Entregable:</Typography>
              <Typography variant="body1">{selectedRecord.entregable}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Responsable:</Typography>
              <Typography variant="body1">{selectedRecord.responsable}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Fecha Inicio:</Typography>
              <Typography variant="body1">{selectedRecord.fechaInicio}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Fecha Término:</Typography>
              <Typography variant="body1">{selectedRecord.fechaTermino}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Estado:</Typography>
              <Typography variant="body1">{selectedRecord.estado}</Typography>
            </Box>
          </Stack>
        )}
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