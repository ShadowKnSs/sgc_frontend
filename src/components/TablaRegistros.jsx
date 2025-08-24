/**
 * Componente: TablaRegistros
 * Descripción:
 * Muestra una tabla paginada de registros de actividades, cada una con información clave como
 * número de actividad, fuente, entradas, entregables, fechas y estado.
 * Permite editar y eliminar registros desde acciones en cada fila.

 * Props:
 * - records: Array de objetos con los datos de cada registro.
 * - handleOpenModal: Función que se invoca al hacer clic en el botón de editar (recibe el índice del registro).
 * - handleDeleteRecord: Función que se invoca al hacer clic en el botón de eliminar (recibe el índice del registro).

 * Estado Local:
 * - `page`: Página actual de la paginación.
 * - `rowsPerPage`: Número de registros mostrados por página (fijo en 5).

 * Renderiza:
 * - Un título "Registros Agregados"
 * - Una tabla `MUI` con encabezado fijo (`stickyHeader`).
 * - Cada fila muestra:
 *    - `record.numero`
 *    - `record.nombreFuente`
 *    - `record.elementoEntrada`, `descripcion`, `entregable` con `Tooltip` para texto largo
 *    - `responsable`, `fechaInicio`, `fechaTermino`, `estado`
 *    - Acciones de editar y eliminar con íconos
 * - Paginación al final de la tabla (`TablePagination`), controlada por `page`.

 * UX/UI:
 * - Diseño responsivo con `overflowX` y sombreado en filas alternas
 * - `Tooltip` para campos truncados (descripción, entregable, etc.)
 * - Colores institucionales:
 *    - Azul en encabezados (`#1976d2`)
 *    - Amarillo (`warning.main`) para editar
 *    - Rojo (`error.main`) para eliminar
 * - Botones con `IconButton` y `Tooltip` para accesibilidad

 * Mejoras Futuras:
 * - 💡 Permitir cambiar `rowsPerPage`
 * - 💡 Agregar ordenamiento por columnas
 * - 💡 Mostrar estado con color codificado o chip

 * Uso Común:
 * - Dentro de formularios que gestionan actividades, como análisis de proceso o planes de mejora
 */

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
