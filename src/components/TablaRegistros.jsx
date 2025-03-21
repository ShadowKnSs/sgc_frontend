import React from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer, IconButton, Typography, Box } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const TablaRegistros = ({ records, handleOpenModal, handleDeleteRecord }) => {
  return (
    <Box sx={{ mt: 4, width: "80%", overflowX: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Registros Agregados
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              {[
                "Número de Actividad",
                "Nombre de la Fuente",
                "Elemento de Entrada",
                "Descripción",
                "Entregable",
                "Responsable",
                "Fecha de Inicio",
                "Fecha de Término",
                "Estado",
                ""
              ].map((header) => (
                <TableCell key={header} sx={{ color: "white", fontWeight: "bold" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record, index) => (
              <TableRow key={index}>
                <TableCell>{record.numero}</TableCell>
                <TableCell>{record.nombreFuente}</TableCell>
                <TableCell>{record.elementoEntrada}</TableCell>
                <TableCell>{record.descripcion}</TableCell>
                <TableCell>{record.entregable}</TableCell>
                <TableCell>{record.responsable}</TableCell>
                <TableCell>{record.fechaInicio}</TableCell>
                <TableCell>{record.fechaTermino}</TableCell>
                <TableCell>{record.estado}</TableCell>
                <TableCell>
                  <IconButton sx={{ color: "orange" }} onClick={() => handleOpenModal(index)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteRecord(index)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TablaRegistros;
