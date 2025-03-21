import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import axios from "axios";
import MenuCard from "../components/menuCard"; 
import { Box, CircularProgress, Alert } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import Title from "../components/Title"; // Asegúrate de importar el componente Title

const ProcessInEntity = () => {
    const { idEntidad } = useParams(); 
    const navigate = useNavigate(); 
    const [procesos, setProcesos] = useState([]);
    const [nombreEntidad, setNombreEntidad] = useState("");
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        if (!idEntidad) {
            console.error("ID de entidad no recibido");
            return;
        }

        axios.get(`http://127.0.0.1:8000/api/procesos/entidad/${idEntidad}`)
            .then(response => {
                console.log("Procesos obtenidos:", response.data);
                setProcesos(response.data.procesos || response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error obteniendo procesos:", error);
                setIsLoading(false);
            });

        axios.get(`http://127.0.0.1:8000/api/entidades/${idEntidad}`)
            .then(response => setNombreEntidad(response.data.nombreEntidad))
            .catch(error => console.error("Error obteniendo el nombre de la entidad:", error));

    }, [idEntidad]);

    return (
        <Box sx={{ textAlign: "center", padding: "20px" }}>
            {/* Título mejorado con el componente Title */}
            <Title text={`Procesos de ${nombreEntidad}`} />

            {/* Indicador de carga elegante */}
            {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                    <CircularProgress color="primary" />
                </Box>
            ) : (
                <Box 
                    sx={{
                        display: "flex", 
                        flexWrap: "wrap", 
                        justifyContent: "center", 
                        gap: "16px", 
                        marginTop: "20px"
                    }}
                >
                    {procesos.length === 0 ? (
                        <Alert severity="warning" sx={{ width: "50%", margin: "0 auto" }}>
                            No se encontraron procesos para esta entidad.
                        </Alert>
                    ) : (
                        procesos.map(proceso => (
                            <MenuCard 
                                key={proceso.idProceso}
                                icon={<WorkIcon />} 
                                title={proceso.nombreProceso}
                                onClick={() => navigate(`/estructura-procesos/${proceso.idProceso}`)} //Se envia el id Proceso
                            />
                        ))
                    )}
                </Box>
            )}
        </Box>
    );
};

export default ProcessInEntity;

