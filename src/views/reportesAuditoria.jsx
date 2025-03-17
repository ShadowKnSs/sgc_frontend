import React, { useState } from "react";
import { Box, Fab, Button, Modal, TextField, MenuItem } from "@mui/material";
import { Add } from "@mui/icons-material";

const initialReports = [
    { id: 1, title: "Facultad de Ingeniería Control Escolar", date: "14/02/2025" },
    { id: 2, title: "Facultad de Ingeniería Control Escolar", date: "14/02/2025" },
    { id: 3, title: "Facultad de Ingeniería Control Escolar", date: "14/02/2025" },
    { id: 4, title: "Facultad de Ingeniería Control Escolar", date: "14/02/2025" },
    { id: 5, title: "Facultad de Ingeniería Control Escolar", date: "14/02/2025" },
    { id: 6, title: "Facultad de Ingeniería Control Escolar", date: "14/02/2025" },
    { id: 7, title: "Facultad de Ingeniería Control Escolar", date: "14/02/2025" },
    { id: 8, title: "Facultad de Ingeniería Control Escolar", date: "14/02/2025" },
    { id: 9, title: "Facultad de Ingeniería Control Escolar", date: "14/02/2025" },
];

const ReportCard = ({ report }) => {
    return (
        <Box
            sx={{
                backgroundColor: "#F9F8F8",
                boxShadow: 2,
                borderRadius: 2,
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                width: 300,
                height: 130,
                justifyContent: "space-between",
            }}
        >
            <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", textAlign: "left", marginTop: "-3px" }}>{report.title}</h3>
            <p style={{ fontSize: "0.9rem", color: "#6c757d", textAlign: "left", marginTop: "-10px" }}>Fecha Auditoría {report.date}</p>
            <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                <Button 
                    variant="contained" 
                    sx={{ 
                        backgroundColor: "#004A98", 
                        borderRadius: "50px", 
                        top: "-5px", 
                        padding: "6px 20px", 
                        textTransform: "none", 
                        fontWeight: "bold" 
                    }}
                >
                    Descargar
                </Button>
            </Box>
        </Box>
    );
};

const ReportesAuditoria = () => {
    const [reports, setReports] = useState(initialReports);
    const [openModal, setOpenModal] = useState(false);

    return (
        <Box sx={{ p: 1, textAlign: "center" }}>
            <h1 style={{ fontSize: "3rem", fontWeight: "bold", color: "#004A98", marginBottom: "3rem", textAlign: "center", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}>Reportes Auditoría</h1>
            <Box 
                display="grid" 
                gridTemplateColumns="repeat(3, 1fr)" 
                gap={10} 
                justifyContent="center"
                maxWidth={1000} 
                margin="auto"
            >
                {reports.map((report) => (
                    <ReportCard key={report.id} report={report} />
                ))}
            </Box>

            <Fab
                color="primary"
                sx={{ position: "fixed", bottom: 16, right: 16, backgroundColor: "primary", width: 70, height: 70, bottom: "50px", right: "50px" }}
                onClick={() => setOpenModal(true)}
            >
                <Add />
            </Fab>
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    height: 350,
                    bgcolor: "white",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 3,
                }}>
                    <h2 style={{ textAlign: "center", color: "#004A98" }}>Generar Reporte De Auditoría</h2>
                    <TextField fullWidth variant="outlined" label="Facultad/Entidad" margin="dense" disabled />
                    <TextField fullWidth variant="outlined" label="Proceso" margin="dense" disabled />
                    <TextField select fullWidth variant="outlined" label="Auditoría" margin="dense" disabled>
                        <MenuItem value="">Seleccione</MenuItem>
                    </TextField>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                        <Button variant="contained" sx={{ backgroundColor: "#004A98", borderRadius: "50px" }} onClick={() => setOpenModal(false)}>Cancelar</Button>
                        <Button variant="contained" sx={{ backgroundColor: "#FFC107", borderRadius: "50px" }}>Generar</Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default ReportesAuditoria;
