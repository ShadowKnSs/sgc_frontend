/**
 * Vista: ReporteSemestral
 * Descripción:
 * Esta vista genera el reporte semestral de un proceso, incluyendo análisis visual y tablas de:
 * - Gestión de Riesgos
 * - Indicadores
 * - Acciones de Mejora
 * - Auditorías Internas
 * - Seguimiento
 * 
 * Funcionalidades:
 * - Captura gráficas con `html2canvas` y genera imágenes base64.
 * - Permite al usuario agregar texto libre: fortalezas, debilidades y conclusión.
 * - Envía los datos al backend para generar y descargar un PDF.
 * - También registra el evento de generación del PDF en la base de datos.

 * Componentes utilizados:
 * - Visuales: `RiesgosChart`, `IndicadoresReport`, `IndicadoresPastel`, etc.
 * - Tablas: `RiesgosTable`, `IndicadoresTable`
 * - Entradas: `TextField`
 * 
 * API involucradas:
 * - POST `/api/generar-pdf`: genera el archivo PDF.
 * - POST `/api/reporte-semestral`: registra el reporte generado.
 */

import html2canvas from "html2canvas";
import { useState, useRef, useEffect } from "react";
import { Box, Paper, Typography, TextField } from "@mui/material";
import RiesgosChart from "../components/componentsReportSem/gestionRiesgos";
import IndicadoresReport from "../components/componentsReportSem/indicadoresRS";
import AccionesMejora from "../components/componentsReportSem/accionesMejoraRS";
import AuditoriasInternas from "../components/componentsReportSem/auditoriasRS";
import Seguimiento from "../components/componentsReportSem/seguimientoRS";
import RiesgosTable from "../components/componentsReportSem/riesgosTable";
import IndicadoresTable from "../components/componentsReportSem/indiTableRS";
import IndicadoresPastel from "../components/componentsReportSem/indiPastelRS";
import { useLocation } from "react-router-dom";
import CustomButton from "../components/Button";
import { useNavigate } from "react-router-dom";


const ReporteSemestral = () => {
    const [conclusion, setConclusion] = useState("");
    const [fortalezas, setFortalezas] = useState("");
    const [debilidades, setDebilidades] = useState("");
    const reporteRef = useRef(null);

    const location = useLocation();
    const { data, anio, periodo } = location.state || {};

    const navigate = useNavigate();

    // Proteger la desestructuración

    const handleCancel = () => {
        navigate(-1); // 👈 regresa a la vista anterior
    };

    // Validación para habilitar botón Descargar
    const canDownload = () => {
        if (!conclusion || conclusion.trim() === "") {
            return false; // siempre debe tener conclusión
        }

        if (datosAuditorias && datosAuditorias.length > 0) {
            return (
                fortalezas.trim() !== "" &&
                debilidades.trim() !== "" &&
                conclusion.trim() !== ""
            );
        }

        // Si no hay auditorías, solo validar conclusión
        return conclusion.trim() !== "";
    };
    const [
        datosRiesgos = [],
        datosIndicadores = [],
        datosAccionesMejora = [],
        datosAuditorias = [],
        datosSeguimiento = []
    ] = data || [];

    useEffect(() => {
    
    }, [data, anio, periodo]);

    //  Fallback si no hay datos (por ejemplo, usuario recargó la página)
    if (!data) {
        return (
            <p style={{ textAlign: "center", marginTop: "2rem" }}>
                 No se recibieron datos para generar el reporte.
            </p>
        );
    }

    const handleDownloadPDF = async () => {
        try {

            // Referencias a los componentes
            const riesgosRef = document.getElementById("riesgos-chart");
            const indicadoresRef = document.getElementById("indicadores-report");
            const indicadoresPRef = document.getElementById("indicadores-report-pastel");

            // Función para capturar imagen de un componente
            const captureImage = async (element, name) => {
                if (!element) {
                    console.warn(`El elemento ${name} no fue encontrado.`);
                    return null;
                }
                try {
                    const canvas = await html2canvas(element, { scale: 2 });
                    return canvas.toDataURL("image/png");
                } catch (error) {
                    return null;
                }
            };

            // Capturar imágenes
            const riesgosImage = await captureImage(riesgosRef, "riesgos-chart");
            const indicadoresImage = await captureImage(indicadoresRef, "indicadores-report");
            const indicadoresPImage = await captureImage(indicadoresPRef, "indicadores-report-pastel");

            // Datos a enviar
            const payload = {
                fortalezas,
                debilidades,
                conclusion,
                anio,
                periodo,
                imagenes: {
                    riesgos: riesgosImage,
                    indicadores: indicadoresImage,
                    indicadoresP: indicadoresPImage,
                },
                listas: {
                    datosRiesgos,
                    datosIndicadores,
                    datosAccionesMejora,
                    datosAuditorias,
                    datosSeguimiento,
                },
            };

            console.log("Datos enviados al backend:", JSON.stringify(payload, null, 2));

            // Enviar al backend para generar y registrar PDF
            const response = await fetch("http://127.0.0.1:8000/api/generar-pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

        if (!response.ok) {
            throw new Error("Error al generar el PDF");
        }

        const data = await response.json();

        //  Abrir PDF en otra pestaña
        window.open(data.url, "_blank");

        // Regresar a la vista anterior después de 1.5s
        setTimeout(() => {
            window.history.back();
        }, 1500);

    } catch (error) {
    }
    
};

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 5 }}>
            <Paper elevation={3} sx={{ width: "50%", padding: 5, bgcolor: "#FFF", paddingLeft: 8, paddingRight: 12, }}>
                <div ref={reporteRef}>
                    <Typography sx={{ fontWeight: "bold", textAlign: "center", color: "#004A98", fontSize: "36px" }}>
                        Reporte Semestral
                    </Typography>
                    <Typography sx={{ fontWeight: "bold", textAlign: "center", mb: 5, color: "#004A98", fontSize: "24px" }}>
                        Ene - Jun 2025
                    </Typography>
                    {datosRiesgos && datosRiesgos.length > 0 && (
                        <Box sx={{ mt: 5, mb: 5 }}>
                            <Typography sx={{ fontWeight: "bold", mb: 3, color: "#000", fontSize: "24px" }}>
                                Gestión de Riesgos
                            </Typography>
                            <Box id="riesgos-chart" >
                                <RiesgosChart data={datosRiesgos} />
                            </Box>
                            <RiesgosTable data={datosRiesgos} />
                        </Box>
                    )}
                    {datosIndicadores && datosIndicadores.length > 0 && (
                        <Box sx={{ mt: 6, mb: 5 }}>
                            <Typography sx={{ fontWeight: "bold", mb: 3, color: "#000", fontSize: "24px" }}>
                                Indicadores
                            </Typography>
                            <Box id="indicadores-report">
                                <IndicadoresReport data={datosIndicadores} />
                            </Box>
                            <IndicadoresTable data={datosIndicadores} />
                            <Typography sx={{ mt: 4, mb: 2, fontWeight: "bold", fontSize: "24px", color: "#004A98" }}>
                                Porcentaje de Cumplimiento e Incumplimiento Semestral
                            </Typography>
                            <Box id="indicadores-report-pastel">
                                <IndicadoresPastel data={datosIndicadores} />
                            </Box>
                        </Box>
                    )}
                    {datosAccionesMejora && datosAccionesMejora.length > 0 && (
                        <Box sx={{ mt: 6, mb: 3 }}>
                            <Typography sx={{ fontWeight: "bold", mb: 3, color: "#000", fontSize: "24px" }}>
                                Acciones de Mejora
                            </Typography>
                            <AccionesMejora data={datosAccionesMejora} />
                        </Box>

                    )}
                    {datosAuditorias && datosAuditorias.length > 0 && (
                        <Box sx={{ mt: 6, mb: 3 }}>
                            <Typography
                                sx={{ fontWeight: "bold", mb: 3, color: "#000", fontSize: "24px" }}
                            >
                                Auditorías Internas
                            </Typography>
                            <AuditoriasInternas data={datosAuditorias} />

                            {/* Campo Fortalezas */}
                            <TextField
                                fullWidth
                                required
                                multiline
                                rows={3}
                                placeholder="Escribe las fortalezas identificadas..."
                                variant="outlined"
                                inputProps={{ maxLength: 500 }}
                                value={fortalezas}
                                onChange={(e) => setFortalezas(e.target.value)}
                                helperText={`${fortalezas.length}/500 caracteres`}
                                sx={{
                                    mt: 3,
                                    mb: 1,
                                    backgroundColor: "#F5F5F5",
                                    borderRadius: "8px",
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": { borderColor: "#B0BEC5" },
                                        "&:hover fieldset": { borderColor: "#1976D2" },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#004A98",
                                            borderWidth: "2px",
                                        },
                                    },
                                    "& .MuiInputBase-input": {
                                        fontSize: "16px",
                                        padding: "12px",
                                    },
                                }}
                            />

                            {/* Campo Debilidades */}
                            <TextField
                                fullWidth
                                required
                                multiline
                                rows={3}
                                placeholder="Escribe las debilidades identificadas..."
                                variant="outlined"
                                inputProps={{ maxLength: 500 }}
                                value={debilidades}
                                onChange={(e) => setDebilidades(e.target.value)}
                                helperText={`${debilidades.length}/500 caracteres`}
                                sx={{
                                    backgroundColor: "#F5F5F5",
                                    borderRadius: "8px",
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": { borderColor: "#B0BEC5" },
                                        "&:hover fieldset": { borderColor: "#1976D2" },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#004A98",
                                            borderWidth: "2px",
                                        },
                                    },
                                    "& .MuiInputBase-input": {
                                        fontSize: "16px",
                                        padding: "12px",
                                    },
                                }}
                            />
                        </Box>
                    )}

                    {datosSeguimiento && datosSeguimiento.length > 0 && (
                        <Box sx={{ mt: 6, mb: 3 }}>
                            <Typography sx={{ fontWeight: "bold", mb: 3, color: "#000", fontSize: "24px" }}>
                                Seguimiento
                            </Typography>
                            <Seguimiento data={datosSeguimiento} />
                        </Box>

                    )}


                    <Box sx={{ mt: 6 }}>
                        <Typography sx={{ fontWeight: "bold", mb: 3, color: "#000", fontSize: "24px" }}>
                            Conclusión
                        </Typography>

                        <TextField
                            fullWidth
                            multiline
                            required
                            rows={3}
                            placeholder="Escribe la conclusión del reporte..."
                            variant="outlined"
                            inputProps={{ maxLength: 600 }}
                            value={conclusion}
                            onChange={(e) => setConclusion(e.target.value)}
                            helperText={`${conclusion.length}/600 caracteres`}
                            sx={{
                                backgroundColor: "#F5F5F5",
                                borderRadius: "8px",
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": { borderColor: "#B0BEC5" },
                                    "&:hover fieldset": { borderColor: "#1976D2" },
                                    "&.Mui-focused fieldset": { borderColor: "#004A98", borderWidth: "2px" },
                                },
                                "& .MuiInputBase-input": {
                                    fontSize: "16px",
                                    padding: "12px",
                                },
                            }}
                        />
                    </Box>
                </div>

                <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 2 }}>

                    <CustomButton
                        type="cancelar"
                        onClick={handleCancel}
                    >
                        Cancelar
                    </CustomButton>
                    <CustomButton
                        type="guardar"
                        onClick={handleDownloadPDF}
                        disabled={!canDownload()}

                    >
                        Guardar
                    </CustomButton>
                </Box>
            </Paper>
        </Box>
    );
};

export default ReporteSemestral;

