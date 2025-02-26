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
              {["Número", "Fuente", "Elemento Entrada", "Descripción Actividad", "Entregable", "Responsable", "Fecha Inicio", "Fecha Término", "Estado", ""].map((header) => (
                <TableCell key={header} sx={{ color: "white", fontWeight: "bold" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record, index) => (
              <TableRow key={index}>
                {Object.values(record).map((value, i) => (
                  <TableCell key={i}>{value}</TableCell>
                ))}
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