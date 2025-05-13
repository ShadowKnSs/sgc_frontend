import React, { useState, useEffect } from "react";
import { Box, Button, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import { Add } from "@mui/icons-material";
import axios from "axios";
import { useParams } from "react-router-dom";
import FormularioProyMejora from "../components/Forms/FormProyMejora";

function ProyectoMejoraContainer({ soloLectura, puedeEditar }) {
  const { idRegistro } = useParams();
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const fetchProyectos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/proyectos-mejora/${idRegistro}`);
      setProyectos(res.data);
    } catch (err) {
      setError("Error al cargar los proyectos de mejora");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (idRegistro) fetchProyectos();
  }, [idRegistro]);

  return (
    <Box sx={{ p: 4 }}>
      {!soloLectura && (
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setMostrarFormulario(true)}
          sx={{ backgroundColor: "secondary.main", mb: 2 }}
        >
          Añadir Proyecto de Mejora
        </Button>
      )}

      {mostrarFormulario ? (
        <FormularioProyMejora
          idRegistro={idRegistro}
          soloLectura={soloLectura}
          puedeEditar={puedeEditar}
          onCancel={() => setMostrarFormulario(false)}
          onSaved={() => {
            setMostrarFormulario(false);
            fetchProyectos();
          }}
        />
      ) : (
        <>
          {loading ? (
            <CircularProgress />
          ) : proyectos.length === 0 ? (
            <Typography>No hay proyectos aún.</Typography>
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {proyectos.map((proj) => (
                <Card key={proj.idProyectoMejora} sx={{ width: 250 }}>
                  <CardContent>
                    <Typography variant="h6">{proj.noMejora || "Proyecto"}</Typography>
                    <Typography variant="body2">{proj.descripcionMejora?.slice(0, 80)}...</Typography>
                    <Typography variant="caption">Responsable: {proj.responsable}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default ProyectoMejoraContainer;
