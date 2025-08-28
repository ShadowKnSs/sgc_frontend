import React, { useEffect, useState } from "react";
import { Box, Alert, Grid, Typography, Tooltip } from "@mui/material";
import CircularProgressIndicator from "./CiruclarProgressIndicador";

const GraficaGestionRiesgos = ({ data = [] }) => {
  const [readyData, setReadyData] = useState([]);

  const colors = ["#F44336", "#FF9800", "#4caf50", "#2196F3", "#9C27B0", "#00ACC1"];

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      setReadyData(data);
    }
  }, [data]);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Alert severity="info">No hay datos de Gestión de Riesgos disponibles.</Alert>
      </Box>
    );
  }

  const truncarTexto = (texto, maxLength = 50) =>
    texto.length > maxLength ? texto.slice(0, maxLength - 3) + "..." : texto;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" align="center" gutterBottom paddingBottom={5}>
        Gestión de Riesgos
      </Typography>

      <Grid container spacing={3} justifyContent={data.length < 3 ? "center" : "flex-start"}>
        {readyData.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Tooltip title={item.nombreIndicador}>
              <div>
                <CircularProgressIndicator
                  label={truncarTexto(item.nombreIndicador)}
                  value={item.resultadoAnual || 0}
                  color={colors[index % colors.length]}
                  aria-label={`Indicador ${item.nombreIndicador}, resultado anual ${item.resultadoAnual || 0}%`}
                />
              </div>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GraficaGestionRiesgos;
