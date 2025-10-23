import React, { useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import CustomButton from "../Button";
import ConfirmDelete from "../confirmDelete";

const ReporteSemCard = ({ id, anio, periodo, fechaGeneracion, ubicacion, onDeleted }) => {
  const [openDelete, setOpenDelete] = useState(false);

  // Convertir periodo a texto legible
  const periodoTexto =
    periodo === "01-06" ? "Ene - Jun" : periodo === "07-12" ? "Jul - Dic" : periodo;

  const handleEliminarClick = () => {
    setOpenDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/delte-repor-sem/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar el reporte: ${response.status}`);
      }

      console.log("Reporte eliminado con éxito");
      setOpenDelete(false);
      if (onDeleted) onDeleted(id);
    } catch (error) {
      console.error("Error al eliminar el reporte:", error);
      alert("No se pudo eliminar el reporte. Intente nuevamente.");
    }
  };

  // Descargar / abrir el reporte en otra pestaña
  const handleDownloadClick = () => {
    if (!ubicacion) {
      alert("Este reporte no tiene archivo asociado.");
      return;
    }

    const url = `http://127.0.0.1:8000/storage/${ubicacion}`;
    console.log("Abriendo reporte en:", url);
    window.open(url, "_blank"); // abre en otra pestaña
  };

  return (
    <>
      <Card
        sx={{
          maxWidth: 345,
          backgroundColor: "#F9F8F8",
          borderLeft: "8px solid #004A98",
          borderRadius: 2,
          p: 2,
        }}
      >
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ color: "#004A98", fontWeight: "bold", mb: 1 }}>
            {`Reporte ${anio} ${periodoTexto}`}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Generado: {fechaGeneracion}
          </Typography>

          {/* Contenedor de botones */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              justifyContent: "center",
              flexWrap: "wrap",
              mt: 2,
            }}
          >
            <CustomButton type="eliminar" onClick={handleEliminarClick}>
              Eliminar
            </CustomButton>

            <CustomButton type="descargar" onClick={handleDownloadClick}>
              Descargar
            </CustomButton>
          </Box>
        </CardContent>
      </Card>

      {/* Modal de confirmación */}
      <ConfirmDelete
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleConfirmDelete}
        entityType="reporte"
        entityName={`Reporte ${anio} ${periodoTexto}`}
      />
    </>
  );
};

export default ReporteSemCard;


