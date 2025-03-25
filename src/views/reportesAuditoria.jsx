import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Fab, Button, Modal, TextField, MenuItem } from "@mui/material";
import { Add } from "@mui/icons-material";

const ReportCard = ({ report, onDelete  }) => {
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
                        backgroundColor: "#B00020", 
                        borderRadius: "50px", 
                        top: "-5px",
                        right: "5px",
                        padding: "6px 20px", 
                        textTransform: "none", 
                        fontWeight: "bold" 
                    }}
                    onClick={() => onDelete(report.id)}
                >
                    Eliminar
                </Button>
                <Button 
                variant="contained" 
                sx={{ backgroundColor: "#004A98", borderRadius: "50px", top: -5, padding: "6px 20px", textTransform: "none", fontWeight: "bold" }}
                onClick={() => window.open(`http://localhost:8000/api/reporte-pdf/${report.idAuditorialInterna}`, '_blank')}
                >
                Descargar
                </Button>
            </Box>
        </Box>
    );
};

const ReportesAuditoria = () => {
    const [reports, setReports] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [auditorias, setAuditorias] = useState([]);
    const [fechaSeleccionada, setFechaSeleccionada] = useState("");
    const [openConfirm, setOpenConfirm] = useState(false);
    const [idAEliminar, setIdAEliminar] = useState(null);
    const navigate = useNavigate();
    
    const confirmarEliminacion = (id) => {
        setIdAEliminar(id);
        setOpenConfirm(true);
    };      

    const fetchAuditorias = async () => {
        try {
          const res = await axios.get("http://localhost:8000/api/auditorias");
          setAuditorias(res.data); // aquí puedes mapear también si lo prefieres
        } catch (err) {
          console.error("Error al obtener auditorías:", err);
        }
    };

    const fetchReportes = async () => {
        try {
          const res = await axios.get("http://localhost:8000/api/reportesauditoria");
          const datos = res.data.map((r) => ({
            id: r.idReporte,
            idAuditorialInterna: r.idAuditorialInterna,
            title: "Auditoría Interna", // puedes agregar luego más info
            date: new Date(r.fechaGeneracion).toLocaleDateString(),
          }));
          setReports(datos);
        } catch (err) {
          console.error("Error al obtener reportes:", err);
        }
    };
    
    const handleEliminarReporte = async () => {
        try {
          await axios.delete(`http://localhost:8000/api/reportesauditoria/${idAEliminar}`);
          setReports(reports.filter(r => r.id !== idAEliminar));
          setOpenConfirm(false);
          setIdAEliminar(null);
        } catch (err) {
          console.error("Error al eliminar reporte:", err);
          alert("Error al eliminar el reporte");
        }
    };      

    const handleGenerar = async () => {
        try {
          const auditoria = auditorias.find(a => a.idAuditorialInterna === fechaSeleccionada);
          if (!auditoria) return alert("Selecciona una auditoría válida");
      
          const payload = {
            idAuditorialInterna: auditoria.idAuditorialInterna,
            hallazgo: auditoria.verificacionRuta?.map(v => v.tipoHallazgo).join(', ') || "Sin hallazgos",
            oportunidadesMejora: auditoria.puntosMejora?.map(p => p.descripcion).join(', ') || "Sin oportunidades",
            cantidadAuditoria: 1, // o un conteo basado en algún criterio si tienes más datos
            ruta: `reporte_${auditoria.idAuditorialInterna}_${Date.now()}.pdf` // puedes modificar según necesites
          };
      
          const res = await axios.post("http://localhost:8000/api/reportesauditoria", payload);
          
          // Opcional: actualizar lista de reportes
          setReports([...reports, {
            id: res.data.idReporte, // asumimos que el backend devuelve el ID
            idAuditorialInterna: auditoria.idAuditorialInterna,
            title: "Auditoría Interna",
            date: new Date(auditoria.fecha).toLocaleDateString()
          }]);
      
          setOpenModal(false);
        } catch (err) {
          console.error("Error al generar reporte:", err);
          alert("Error al generar reporte");
        }
    };             

    useEffect(() => {
        fetchReportes();
        const cargarAuditorias = async () => {
            try {
              const res = await axios.get("http://localhost:8000/api/auditorias");
              setAuditorias(res.data); // Asegúrate que esto sea un array de auditorías con `fecha` y `idAuditorialInterna`
            } catch (err) {
              console.error("Error al cargar auditorías:", err);
            }
          };
        cargarAuditorias();
        if (openModal) {
          fetchAuditorias();
        }
    }, [openModal]);

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
                    <ReportCard key={report.id} report={report} onDelete={confirmarEliminacion} />
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
                    <TextField select fullWidth variant="outlined" label="Auditoría" margin="dense" value={fechaSeleccionada}
                        onChange={(e) => setFechaSeleccionada(e.target.value)}
                        >
                        {auditorias.map((aud) => (
                            <MenuItem key={aud.idAuditorialInterna} value={aud.idAuditorialInterna}>
                            {new Date(aud.fecha).toLocaleDateString()}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                        <Button variant="contained" sx={{ backgroundColor: "#004A98", borderRadius: "50px" }} onClick={() => setOpenModal(false)}>Cancelar</Button>
                        <Button variant="contained" sx={{ backgroundColor: "#FFC107", borderRadius: "50px" }} 
                        onClick={() => {
                            setOpenModal(false);
                            navigate(`/vista-previa/${fechaSeleccionada}`);
                        }}
                        >
                        Generar
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Modal open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 380,
                    bgcolor: "white",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 3,
                    textAlign: "center"
                }}>
                    <h2 style={{ marginBottom: "1rem", color: "#B00020" }}>¿Eliminar Reporte?</h2>
                    <p>Esta acción no se puede deshacer.</p>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
                    <Button variant="outlined" onClick={() => setOpenConfirm(false)} sx={{ borderRadius: '50px' }}>
                        Cancelar
                    </Button>
                    <Button variant="contained" color="error" onClick={handleEliminarReporte} sx={{ borderRadius: '50px' }}>
                        Confirmar
                    </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default ReportesAuditoria;
