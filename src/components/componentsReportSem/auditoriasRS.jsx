import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, TextField } from "@mui/material";

const AuditoriasInternas = ({ data }) => {
    // Estados para los campos de fortalezas y debilidades
    const [fortalezas, setFortalezas] = useState("");
    const [debilidades, setDebilidades] = useState("");

    return (
        <Box sx={{ width: "100%", textAlign: "center" }}>
            {/* Título */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Auditorías Internas
            </Typography>

            {/* Tabla */}
            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>No.</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Proceso</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Entidad</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Auditor Líder</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Fecha</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.NombreProceso}</TableCell>
                                <TableCell>{item.Entidad}</TableCell>
                                <TableCell>{item.AuditorLider}</TableCell>
                                <TableCell>{item.fecha}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Campos de Captura */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                    label="Fortalezas Identificadas en el Semestre"
                    variant="outlined"
                    multiline
                    rows={3}
                    inputProps={{ maxLength: 255 }}
                    value={fortalezas}
                    onChange={(e) => setFortalezas(e.target.value)}
                />
                <TextField
                    label="Debilidades Identificadas en el Semestre"
                    variant="outlined"
                    multiline
                    rows={3}
                    inputProps={{ maxLength: 255 }}
                    value={debilidades}
                    onChange={(e) => setDebilidades(e.target.value)}
                />
            </Box>
        </Box>
    );
};

export default AuditoriasInternas;
