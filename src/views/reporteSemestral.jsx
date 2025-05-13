import html2canvas from "html2canvas";
import { useState, useRef } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import RiesgosChart from "../components/componentsReportSem/gestionRiesgos";
import IndicadoresReport from "../components/componentsReportSem/indicadoresRS";
import AccionesMejora from "../components/componentsReportSem/accionesMejoraRS";
import AuditoriasInternas from "../components/componentsReportSem/auditoriasRS";
import Seguimiento from "../components/componentsReportSem/seguimientoRS";
import RiesgosTable from "../components/componentsReportSem/riesgosTable";
import IndicadoresTable from "../components/componentsReportSem/indiTableRS";
import IndicadoresPastel from "../components/componentsReportSem/indiPastelRS";
import { useLocation } from "react-router-dom";


const ReporteSemestral = () => {
    const [conclusion, setConclusion] = useState("");
    const [fortalezas, setFortalezas] = useState("");
    const [debilidades, setDebilidades] = useState("");
    const reporteRef = useRef(null);
    const location = useLocation();
    const { data, anio, periodo } = location.state || {};

    const [datosRiesgos, datosIndicadores, datosAccionesMejora, datosAuditorias, datosSeguimiento] = data;
    console.log("datos de ",datosRiesgos, datosIndicadores, datosAccionesMejora, datosAuditorias, datosSeguimiento );


    const handleDownloadPDF = async () => {
        try {
            console.log("Iniciando la captura de imágenes...");

            // Referencias a los componentes
            const riesgosRef = document.getElementById("riesgos-chart");
            const indicadoresRef = document.getElementById("indicadores-report");
            const indicadoresPRef = document.getElementById("indicadores-report-pastel");

            // Función para capturar una imagen de un componente
            const captureImage = async (element, name) => {
                if (!element) {
                    console.warn(`El elemento ${name} no fue encontrado.`);
                    return null;
                }
                try {
                    const canvas = await html2canvas(element, { scale: 2 });
                    return canvas.toDataURL("image/png");
                } catch (error) {
                    console.error(`Error al capturar la imagen de ${name}:`, error);
                    return null;
                }
            };

            // Capturar las imágenes de cada componente
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

            // Enviar los datos al backend para generar el PDF
            const response = await fetch("http://127.0.0.1:8000/api/generar-pdf", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor: ${response.status}`);
            }

            console.log("PDF generado correctamente, iniciando descarga...");

            const blob = await response.blob();
            if (blob.size === 0) {
                throw new Error("El archivo PDF generado está vacío.");
            }

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "reporte-semestral.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            console.log("Descarga completada.");

            // **Registrar en la base de datos que se generó el reporte**
            const registroPayload = {
                anio,
                periodo,
                fortalezas: fortalezas || null,
                debilidades: debilidades || null,
                conclusion,
                fechaGeneracion: new Date().toISOString().slice(0, 19).replace("T", " "),
                ubicacion: "ruta/del/reporte-semestral.pdf"
            };

            const registroResponse = await fetch("http://127.0.0.1:8000/api/reporte-semestral", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registroPayload),
            });

            if (!registroResponse.ok) {
                throw new Error("Error al registrar el reporte en la base de datos.");
            }

            console.log("Registro de reporte semestral guardado en la base de datos.");

            // **Redirigir a la vista anterior**
            window.location.href = "/principalReportSem";

        } catch (error) {
            console.error("Error en el proceso:", error);
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
                            <Typography sx={{ fontWeight: "bold", mb: 3, color: "#000", fontSize: "24px" }}>
                                Auditorías Internas
                            </Typography>
                            <AuditoriasInternas data={datosAuditorias} />

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Escribe las fortalezas identificadas..."
                                variant="outlined"
                                inputProps={{ maxLength: 500 }}
                                value={fortalezas}
                                onChange={(e) => setFortalezas(e.target.value)}
                                sx={{
                                    mt: 3,
                                    mb: 3,
                                    backgroundColor: "#F5F5F5",
                                    borderRadius: "8px",
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": { borderColor: "#B0BEC5" }, // Color del borde normal
                                        "&:hover fieldset": { borderColor: "#1976D2" }, // Color del borde al pasar el mouse
                                        "&.Mui-focused fieldset": { borderColor: "#004A98", borderWidth: "2px" }, // Color y grosor del borde al hacer foco
                                    },
                                    "& .MuiInputBase-input": {
                                        fontSize: "16px",
                                        padding: "12px",
                                    },
                                }}
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Escribe las debilidades identificadas..."
                                variant="outlined"
                                inputProps={{ maxLength: 500 }}
                                value={debilidades}
                                onChange={(e) => setDebilidades(e.target.value)}
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
                            rows={3}
                            placeholder="Escribe la conclusión del reporte..."
                            variant="outlined"
                            inputProps={{ maxLength: 600 }}
                            value={conclusion}
                            onChange={(e) => setConclusion(e.target.value)}
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
                    <Button
                        variant="contained"
                        sx={{ bgcolor: "#004A98", color: "white", "&:hover": { bgcolor: "#003974" } }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ bgcolor: "#F9B800", color: "white", "&:hover": { bgcolor: "#D99A00" } }}
                        onClick={handleDownloadPDF}
                    >
                        Descargar PDF
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default ReporteSemestral;

/*{datosAccionesMejora && datosAccionesMejora.length > 0 && (
                        <Box sx={{ mt: 6, mb: 3 }}>
                            <Typography sx={{ fontWeight: "bold", mb: 3, color: "#000", fontSize: "24px" }}>
                                Acciones de Mejora
                            </Typography>
                            <AccionesMejora data={datosAccionesMejora} />
                        </Box>

                    )}*/

/*{datosAuditorias && datosAuditorias.length > 0 && (
                        <Box sx={{ mt: 6, mb: 3 }}>
                            <Typography sx={{ fontWeight: "bold", mb: 3, color: "#000", fontSize: "24px" }}>
                                Auditorías Internas
                            </Typography>
                            <AuditoriasInternas data={datosAuditorias} />

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Escribe las fortalezas identificadas..."
                                variant="outlined"
                                inputProps={{ maxLength: 500 }}
                                value={fortalezas}
                                onChange={(e) => setFortalezas(e.target.value)}
                                sx={{
                                    mt: 3,
                                    mb: 3,
                                    backgroundColor: "#F5F5F5",
                                    borderRadius: "8px",
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": { borderColor: "#B0BEC5" }, // Color del borde normal
                                        "&:hover fieldset": { borderColor: "#1976D2" }, // Color del borde al pasar el mouse
                                        "&.Mui-focused fieldset": { borderColor: "#004A98", borderWidth: "2px" }, // Color y grosor del borde al hacer foco
                                    },
                                    "& .MuiInputBase-input": {
                                        fontSize: "16px",
                                        padding: "12px",
                                    },
                                }}
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Escribe las debilidades identificadas..."
                                variant="outlined"
                                inputProps={{ maxLength: 500 }}
                                value={debilidades}
                                onChange={(e) => setDebilidades(e.target.value)}
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

                    )}*/

/*{datosSeguimiento && datosSeguimiento.length > 0 && (
                        <Box sx={{ mt: 6, mb: 3 }}>
                            <Typography sx={{ fontWeight: "bold", mb: 3, color: "#000", fontSize: "24px" }}>
                                Seguimiento
                            </Typography>
                            <Seguimiento data={datosSeguimiento} />
                        </Box>

                    )}*/

/*{datosRiesgos && datosRiesgos.length > 0 && (
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
*/