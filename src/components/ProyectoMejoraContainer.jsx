import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import FormularioProyMejora from "../components/Forms/FormProyMejora";
import DetalleProyectoModal from "../components/Modals/DetalleProyectoModal";
import CustomButton from "../components/Button";
import { useProyectosMejora } from "../hooks/useProyectosMejora";

function ProyectoMejoraContainer({ soloLectura, puedeEditar }) {
  const { idRegistro } = useParams();
  const {
    proyectos,
    loading,
    error,
    hasProyectos,
    refetch,
  } = useProyectosMejora(idRegistro);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  return (
    <Box sx={{ p: 4 }}>
      {!soloLectura && !mostrarFormulario && (
        <CustomButton
          type="guardar"
          startIcon={<Add />}
          onClick={() => setMostrarFormulario(true)}
        >
          Nuevo Proyecto de Mejora
        </CustomButton>
      )}

      {mostrarFormulario ? (
        <FormularioProyMejora
          idRegistro={idRegistro}
          soloLectura={soloLectura}
          puedeEditar={puedeEditar}
          onCancel={() => setMostrarFormulario(false)}
          onSaved={() => {
            setMostrarFormulario(false);
            refetch();
          }}
        />
      ) : loading ? (
        <Box sx={{ mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ mt: 4 }}>{error}</Typography>
      ) : !hasProyectos ? (
        <Typography sx={{ mt: 4 }}>No hay proyectos aún.</Typography>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
          {proyectos.map((proj) => (
            <Card
              key={proj.idProyectoMejora}
              sx={{ width: 250, cursor: "pointer" }}
              onClick={() => setProyectoSeleccionado(proj)}
            >
              <CardContent>
                <Typography variant="h6">
                  {proj.noMejora != null ? `Mejora #${proj.noMejora}` : "Proyecto sin número"}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {proj.descripcionMejora ? `${proj.descripcionMejora.slice(0, 80)}...` : "Sin descripción"}
                </Typography>
                <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                  Responsable: {proj.responsable || "No definido"}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <DetalleProyectoModal
        open={!!proyectoSeleccionado}
        onClose={() => setProyectoSeleccionado(null)}
        proyecto={proyectoSeleccionado}
      />
    </Box>
  );
}

export default ProyectoMejoraContainer;
