import { useState } from "react";
import { Box, Fab, Modal, TextField, MenuItem, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Title from "../components/Title";

const PrincipalReportSem = () => {
    const [open, setOpen] = useState(false);
    const [year, setYear] = useState("");
    const [period, setPeriod] = useState("");

    const handleOpenForm = () => setOpen(true);
    const handleCloseForm = () => {
        setOpen(false);
        setYear("");
        setPeriod("");
    };

    const handleGenerateReport = () => {
        console.log(`Generando reporte para ${period} de ${year}`);
        handleCloseForm();
    };

    return (
        <Box>
            {/* Título */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 5,  // Ajusta la distancia desde el header
                    mb: 5,
                    position: "relative", // Asegura que no se superponga con elementos fijos
                    zIndex: 1 // Eleva el título en caso de solapamiento
                }}
            >
                <Title text="Reportes Semestrales" sx={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold" }} />
            </Box>

            {/* Botón flotante */}
            <Fab color="primary" aria-label="add" sx={{ position: "fixed", bottom: 20, right: 20 }} onClick={handleOpenForm}>
                <AddIcon />
            </Fab>

            {/* Modal */}
            <Modal open={open} onClose={handleCloseForm} aria-labelledby="modal-title">
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "white",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <h2 id="modal-title" style={{ color: "#004A98", textAlign: "center", fontSize:"28px"}}>
                        Generar Reporte Semestral
                    </h2>

                    {/* Campo Año */}
                    <TextField
                        label="Año"
                        type="number"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    />

                    {/* Campo Período */}
                    <TextField
                        select
                        label="Período"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                    >
                        <MenuItem value="Enero-Junio">Enero - Junio</MenuItem>
                        <MenuItem value="Julio-Diciembre">Julio - Diciembre</MenuItem>
                    </TextField>

                    {/* Botones */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                        <Button
                            onClick={handleCloseForm}
                            sx={{ backgroundColor: "#004A98", color: "white", "&:hover": { backgroundColor: "#003366" }, borderRadius: "30px", // Redondear los bordes
                            padding: "8px 16px"}}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleGenerateReport}
                            sx={{ backgroundColor: "#F9B800", color: "white", "&:hover": { backgroundColor: "#D99400" }, borderRadius: "30px", // Redondear los bordes
                            padding: "8px 16px" }}
                            disabled={!year || !period}
                        >
                            Generar
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default PrincipalReportSem;
