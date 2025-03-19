import html2canvas from "html2canvas";
import { useState, useRef } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import RiesgosChart from "../components/componentsReportSem/gestionRiesgos";
import IndicadoresReport from "../components/componentsReportSem/indicadoresRS";
import AccionesMejora from "../components/componentsReportSem/accionesMejoraRS";
import AuditoriasInternas from "../components/componentsReportSem/auditoriasRS";
import Seguimiento from "../components/componentsReportSem/seguimientoRS";
import axios from "axios";

const data = [
    { NombreProceso: "Proceso A", Entidad: "Entidad 1", valorSeveridad: 5, valorOcurrencia: 3, valorNRP: 15, fuente: "Fuente X" },
    { NombreProceso: "Proceso B", Entidad: "Entidad 2", valorSeveridad: 2, valorOcurrencia: 4, valorNRP: 8, fuente: "Fuente Y" },
    { NombreProceso: "Proceso C", Entidad: "Entidad 3", valorSeveridad: 7, valorOcurrencia: 2, valorNRP: 14, fuente: "Fuente Z" },
];
const datosIndicadores = [
    { NombreProceso: "Proceso 1", Entidad: "Entidad A", nombreIndicador: "Indicador A", origenIndicador: "Manual", resultado: 90 },
    { NombreProceso: "Proceso 2", Entidad: "Entidad B", nombreIndicador: "Indicador B", origenIndicador: "Automático", resultado: 75 },
    { NombreProceso: "Proceso 3", Entidad: "Entidad C", nombreIndicador: "Indicador C", origenIndicador: "Manual", resultado: 60 },
];
const datosAccionesMejora = [
    { NombreProceso: "Proceso 1", Entidad: "Entidad A", fuente: "Fuente A", entregable: "Documento A", responsable: "Juan Pérez", estado: "En proceso" },
    { NombreProceso: "Proceso 2", Entidad: "Entidad B", fuente: "Fuente B", entregable: "Informe B", responsable: "María Gómez", estado: "Cerrado" },
    { NombreProceso: "Proceso 3", Entidad: "Entidad C", fuente: "Fuente C", entregable: "Reporte C", responsable: "Carlos Ramírez", estado: "En proceso" }
];
const datosAuditorias = [
    { NombreProceso: "Proceso A", Entidad: "Entidad X", AuditorLider: "Juan Pérez", fecha: "2024-03-10" },
    { NombreProceso: "Proceso B", Entidad: "Entidad Y", AuditorLider: "María Gómez", fecha: "2024-04-15" },
    { NombreProceso: "Proceso C", Entidad: "Entidad Z", AuditorLider: "Carlos Ramírez", fecha: "2024-05-20" }
];
const datosSeguimiento = [
    { NombreProceso: "Proceso A", Entidad: "Entidad X", fecha: "2024-03-10" },
    { NombreProceso: "Proceso B", Entidad: "Entidad Y", fecha: "2024-04-15" },
    { NombreProceso: "Proceso C", Entidad: "Entidad Z", fecha: "2024-05-20" }
];

const ReporteSemestral = () => {
    const [conclusion, setConclusion] = useState("");
    const reporteRef = useRef(null);

    const handleDownloadPDF = async () => {
        if (!reporteRef.current) return;

        try {
            const canvas = await html2canvas(reporteRef.current, { scale: 2 });
            const image = canvas.toDataURL("image/png");
            
            const response = await fetch("http://127.0.0.1:8000/api/generar-pdf", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    conclusion,
                    reporteImagen: image,
                }),
            });
    
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "reporte-semestral.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error al generar el PDF:", error);
        }
    };    

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 5 }}>
            <Paper elevation={3} sx={{ width: "80%", padding: 4, bgcolor: "#F5F5F5" }}>
                <div ref={reporteRef}>
                    <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}>
                        Reporte Semestral
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                        <RiesgosChart data={data} />
                    </Box>
                    <Box sx={{ mb: 3 }}>
                        <IndicadoresReport data={datosIndicadores} />
                    </Box>
                    <Box sx={{ mb: 3 }}>
                        <AccionesMejora data={datosAccionesMejora} />
                    </Box>
                    <Box sx={{ mb: 3 }}>
                        <AuditoriasInternas data={datosAuditorias} />
                    </Box>
                    <Box sx={{ mb: 3 }}>
                        <Seguimiento data={datosSeguimiento} />
                    </Box>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                            Conclusión
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Escribe la conclusión del reporte..."
                            variant="outlined"
                            inputProps={{ maxLength: 255 }}
                            value={conclusion}
                            onChange={(e) => setConclusion(e.target.value)}
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