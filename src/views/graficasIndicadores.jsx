import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Alert, 
  CircularProgress 
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GraficasPage = () => {
  // Datos de muestra locales para el gráfico
  const sampleData = {
    labels: ["2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06"],
    datasets: [
      {
        label: "Indicador de Calidad",
        data: [65, 59, 80, 81, 56, 55],
        borderColor: "#F9B800",
        backgroundColor: "rgba(249, 184, 0, 0.2)",
        tension: 0.4
      },
      {
        label: "Indicador de Desempeño",
        data: [28, 48, 40, 19, 86, 27],
        borderColor: "#00B2E3",
        backgroundColor: "rgba(0, 178, 227, 0.2)",
        tension: 0.4
      }
    ]
  };

  // Estados para el rango de fechas (de ejemplo)
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-06-01");
  const [error, setError] = useState("");
  const [data, setData] = useState(sampleData);
  const [loading, setLoading] = useState(false);

  // Función de ejemplo para "actualizar" datos con base en un rango de fechas
  const handleUpdate = () => {
    // Validación simple del rango de fechas
    if (new Date(endDate) < new Date(startDate)) {
      setError("La fecha de fin no puede ser anterior a la fecha de inicio.");
      return;
    }
    setError("");
    setLoading(true);

    // Simular una espera para actualizar los datos
    setTimeout(() => {
      // Aquí podrías filtrar o modificar los datos según el rango seleccionado.
      // En este ejemplo, simplemente se mantiene el sampleData.
      setData(sampleData);
      setLoading(false);
    }, 1000);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography 
        variant="h4" 
        align="center" 
        gutterBottom 
        sx={{ fontFamily: "'Roboto', sans-serif", color: "primary.main", fontWeight: "bold" }}
      >
        Gráficas de Indicadores
      </Typography>

      {/* Controles para el rango de fechas */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4, flexWrap: "wrap" }}>
        <TextField
          label="Fecha de inicio"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Fecha de fin"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" onClick={handleUpdate} sx={{ height: "56px" }}>
          Actualizar
        </Button>
      </Box>

      {/* Mensaje de error si ocurre */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Mostrar spinner de carga o el gráfico */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ maxWidth: "100%", overflowX: "auto" }}>
          <Line
            data={data}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Resultados de Indicadores" },
              },
              interaction: {
                mode: "index",
                intersect: false,
              },
              scales: {
                x: {
                  title: { display: true, text: "Mes" },
                },
                y: {
                  title: { display: true, text: "Valor" },
                },
              },
              animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
              }
            }}
          />
        </Box>
      )}

      <Typography variant="body1" align="center" sx={{ mt: 4 }}>
        Aquí se mostrarán las gráficas de los resultados de los indicadores.
      </Typography>
    </Container>
  );
};

export default GraficasPage;
