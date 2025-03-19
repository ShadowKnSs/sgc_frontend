import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from "@mui/material";

const Seguimiento = ({ data }) => {
    return (
        <Box sx={{ width: "100%", textAlign: "center" }}>
            {/* Título */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Seguimiento
            </Typography>

            {/* Tabla */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>No.</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Proceso</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Entidad</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Fecha</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.NombreProceso}</TableCell>
                                <TableCell>{item.Entidad}</TableCell>
                                <TableCell>{item.fecha}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Seguimiento;
