import React, { useEffect, useState } from "react";
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, CircularProgress } from "@mui/material";
import axios from "axios";

const TablaSatisfaccionCliente = ({ idProceso, anio }) => {
    const [datos, setDatos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/indicadores/satisfaccion-cliente/${idProceso}/${anio}`)
            .then(res => setDatos(res.data || []))
            .catch(err => console.error("Error al cargar datos:", err))
            .finally(() => setLoading(false));
    }, [idProceso, anio]);

    if (loading) return <CircularProgress />;
    if (!Array.isArray(datos) || datos.length === 0) return <Typography color="error">No se encontraron datos.</Typography>;

    const encuestas = datos.filter(item => item.origen === "Encuesta");
    const retroalimentaciones = datos.filter(item => item.origen === "Retroalimentacion");
    const noEncuestas = encuestas?.[0]?.noEncuestas ?? 0;

    const getPct = (value) => noEncuestas > 0 ? ((value / noEncuestas) * 100).toFixed(2) : "-";

    const totalFelicitaciones = retroalimentaciones.reduce((acc, { felicitaciones = 0 }) => acc + felicitaciones, 0);
    const totalSugerencias = retroalimentaciones.reduce((acc, { sugerencias = 0 }) => acc + sugerencias, 0);
    const totalQuejas = retroalimentaciones.reduce((acc, { quejas = 0 }) => acc + quejas, 0);
    const totalRetro = totalFelicitaciones + totalSugerencias + totalQuejas;

    // Valores generales de interpretación y necesidad
    const interpretacionGeneral = encuestas[0]?.interpretacion ?? 'No hay interpretacion';
    const necesidadGeneral = encuestas[0]?.necesidada ?? 'No hay necesidad';

    return (
        <Box sx={{ mt: 4, mx: 7, p: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}> 9.1.3 b{")"} Satisfacción del cliente</Typography>
            <Paper elevation={3}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={10} align="center" sx={{ fontWeight: 'bold', backgroundColor: '#0e75cb', color: '#fff' }}>
                                Encuesta de Satisfacción
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell>Descripción del Indicador</TableCell>
                            <TableCell>No. Encuestas</TableCell>
                            <TableCell>E+B (%)</TableCell>
                            <TableCell>R (%)</TableCell>
                            <TableCell>M (%)</TableCell>
                            <TableCell>Meta</TableCell>
                            <TableCell>Anual</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {encuestas.map((item, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell>{item.nombreIndicador}</TableCell>
                                <TableCell>{noEncuestas}</TableCell>
                                <TableCell>{getPct((item.bueno ?? 0) + (item.excelente ?? 0))}%</TableCell>
                                <TableCell>{getPct(item.regular ?? 0)}%</TableCell>
                                <TableCell>{getPct(item.malo ?? 0)}%</TableCell>
                                <TableCell>{item.meta ?? '-'}%</TableCell>
                                <TableCell>{getPct((item.bueno ?? 0) + (item.excelente ?? 0))}%</TableCell>

                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={10} align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                                Retroalimentación
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell>Descripción del Indicador</TableCell>
                            <TableCell>F</TableCell>
                            <TableCell>S</TableCell>
                            <TableCell>Q</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell colSpan={4} />
                        </TableRow>
                        {retroalimentaciones.map((item, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell>{item.nombreIndicador}</TableCell>
                                <TableCell>{item.felicitaciones ?? 0}</TableCell>
                                <TableCell>{item.sugerencias ?? 0}</TableCell>
                                <TableCell>{item.quejas ?? 0}</TableCell>
                                <TableCell>{item.total ?? 0}</TableCell>
                                <TableCell colSpan={4} />
                            </TableRow>
                        ))}
                        <TableRow sx={{ fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                            <TableCell colSpan={2}>Total Retroalimentación</TableCell>
                            <TableCell>{totalFelicitaciones}</TableCell>
                            <TableCell>{totalSugerencias}</TableCell>
                            <TableCell>{totalQuejas}</TableCell>
                            <TableCell>{totalRetro}</TableCell>
                            <TableCell colSpan={4} />
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={5}><strong>Interpretación:</strong> {interpretacionGeneral}</TableCell>
                            <TableCell colSpan={5}><strong>Necesidad:</strong> {necesidadGeneral}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
};

export default TablaSatisfaccionCliente;
