import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import axios from "axios";
import MenuCard from "../components/menuCard"; 
import WorkIcon from "@mui/icons-material/Work"; 

const ProcessInEntity = () => {
    const { idEntidad } = useParams(); 
    const navigate = useNavigate(); 
    const [procesos, setProcesos] = useState([]);
    const [nombreEntidad, setNombreEntidad] = useState("");
    const [isLoading, setIsLoading] = useState(true); // Estado de carga

    useEffect(() => {
        if (!idEntidad) {
            console.error("ID de entidad no recibido");
            return;
        }

        // Obtener procesos
        axios.get(`http://127.0.0.1:8000/api/procesos/entidad/${idEntidad}`)
            .then(response => {
                console.log("Procesos obtenidos:", response.data); // Verifica cómo se estructura la respuesta
                // Si los procesos están dentro de response.data.procesos, usa esa propiedad
                setProcesos(response.data.procesos || response.data);  // Ajusta según la respuesta real
                setIsLoading(false);  // Cambiar estado de carga a false
            })
            .catch(error => {
                console.error("Error obteniendo procesos:", error);
                setIsLoading(false);  // En caso de error, dejar de cargar
            });

        // Obtener nombre de la entidad
        axios.get(`http://127.0.0.1:8000/api/entidades/${idEntidad}`)
            .then(response => setNombreEntidad(response.data.nombreEntidad))
            .catch(error => console.error("Error obteniendo el nombre de la entidad:", error));

    }, [idEntidad]);

    // Si estamos cargando, mostramos un mensaje
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Procesos de {nombreEntidad}</h1> 

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", marginTop: "20px" }}>
                {/* Verificamos que 'procesos' sea un arreglo antes de usar map */}
                {procesos.length === 0 && !isLoading && (
                    <div>No se encontraron procesos para esta entidad.</div>
                )}

                {Array.isArray(procesos) && procesos.length > 0 ? (
                    procesos.map(proceso => {
                        console.log("Creando tarjeta para el proceso", proceso.idProceso);
                        return (
                            <MenuCard 
                                key={proceso.idProceso}
                                icon={<WorkIcon />} 
                                title={proceso.nombreProceso}
                                onClick={() => navigate(`/estructura-procesos/${proceso.idProceso}`)}
                            />
                        );
                    })
                ) : (
                    <div>No se encontraron procesos.</div>
                )}
            </div>
        </div>
    );
};

export default ProcessInEntity;
