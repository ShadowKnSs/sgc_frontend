import React, { useState } from "react";
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Paper, TableContainer, IconButton, Typography, Box, Tooltip, TablePagination
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const TablaRegistros = ({ records, handleOpenModal, handleDeleteRecord }) => {
  const headers = [
    "No. Actividad",
    "Fuente",
    "Elemento de Entrada",
    "Descripción",
    "Entregable",
    "Responsable",
    "Fecha de Inicio",
    "Fecha de Término",
    "Estado",
    "Acciones"
  ];

  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const registrosPaginados = records.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ mt: 4, width: "95%", overflowX: "auto" }}>
      <Typography variant="h5" gutterBottom color="primary">
        Registros Agregados
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell
                key={header}
                sx={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  fontWeight: "bold",
                  whiteSpace: "nowrap"
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {registrosPaginados.map((record, index) => (
            <TableRow
              key={index}
              sx={{ "&:nth-of-type(odd)": { bgcolor: "#f9f9f9" }, transition: "all 0.2s ease-in-out" }}
              hover
            >
              <TableCell>{record.numero}</TableCell>
              <TableCell>{record.nombreFuente}</TableCell>
              <TableCell>
                <Tooltip title={record.descripcion}>
                  <span style={{ display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 }}>
                    {record.elementoEntrada}
                  </span>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title={record.descripcion}>
                  <span style={{ display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 }}>
                    {record.descripcion}
                  </span>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title={record.entregable}>
                  <span style={{ display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 }}>
                    {record.entregable}
                  </span>
                </Tooltip>
              </TableCell>
              <TableCell>{record.responsable}</TableCell>
              <TableCell>{record.fechaInicio}</TableCell>
              <TableCell>{record.fechaTermino}</TableCell>
              <TableCell>{record.estado}</TableCell>
              <TableCell>
                <Tooltip title="Editar">
                  <IconButton sx={{ color: "warning.main" }} onClick={() => handleOpenModal(index)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                  <IconButton sx={{ color: "error.main" }} onClick={() => handleDeleteRecord(index)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={records.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5]}
      />

    </TableContainer>

      
    </Box >
  );
};

export default TablaRegistros;
