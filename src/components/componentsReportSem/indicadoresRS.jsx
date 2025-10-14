import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts";
import { Box, Typography } from "@mui/material";

const CustomBar = (props) => {
  const { x, y, width, height, payload, fill } = props;

  const promedioEsCero = payload.promedio === 0;

  if (promedioEsCero) {

    const minHeight = 30; 
    const centerY = y + minHeight / 2;

    return (
      <g>
        <rect 
          x={x} 
          y={y + height - minHeight} 
          width={width} 
          height={minHeight} 
          fill="#f0f0f0" 
          radius={[5, 5, 0, 0]} 
        />
        <text 
          x={x + width / 2} 
          y={y + height - minHeight / 2} 
          fill="#555" 
          textAnchor="middle" 
          dominantBaseline="central"
          fontSize={10}
          fontWeight="bold"
        >
          Promedio 0% ⚠️
        </text>
      </g>
    );
  }

  return (
    <rect 
      x={x} 
      y={y} 
      width={width} 
      height={height} 
      fill={fill} 
      radius={[5, 5, 0, 0]} 
    />
  );
};


const IndicadoresReport = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No hay datos disponibles para el reporte.</p>;
  }

  const grupos = {};

  data.forEach((item) => {
    const tipo = item.origenIndicador || "Desconocido";
    const valor =
      item.resultado !== null && item.resultado !== undefined
        ? Number(item.resultado)
        : null;

    if (valor !== null) {
      if (!grupos[tipo]) {
        grupos[tipo] = { total: 0, count: 0 };
      }
      grupos[tipo].total += valor;
      grupos[tipo].count += 1;
    }
  });


  const promedios = Object.keys(grupos).map((tipo) => {
    const promedioCalculado = grupos[tipo].total / grupos[tipo].count;
    return {
      tipo,
      promedio: promedioCalculado,
     
      esCero: promedioCalculado === 0, 
    };
  });

  const totalWidth = 800; 
  const barSize = Math.max(totalWidth / promedios.length - 15, 30); 

  return (
    <Box 
      sx={{ 
        width: "100%", 
        maxWidth: totalWidth + 50, 
        margin: "0 auto", 
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", 
        backgroundColor: "#FFFFFF" 
      }}
    >

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={promedios}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }} 
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
          
          <XAxis
            dataKey="tipo"
            stroke="#004A98"
            angle={-30} 
            textAnchor="end"
            interval={0}
            height={80} 
            style={{ fontSize: '12px' }} 
          />
          
          <YAxis 
            domain={[0, 100]} 
            stroke="#004A98" 
            label={{ value: 'Promedio (%)', angle: -90, position: 'insideLeft', fill: '#004A98', dx: -5 }} // Etiqueta para Y
          />
          
          <Tooltip
            contentStyle={{ 
              backgroundColor: "rgba(255, 255, 255, 0.9)", 
              borderRadius: "5px", 
              border: "1px solid #00B2E3",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}
            formatter={(value) => [`${value.toFixed(2)}%`, "Promedio"]} 
          />
          
          <Legend 
            wrapperStyle={{ 
              paddingTop: '20px',
              color: "#004A98", 
              fontWeight: "600",
              fontSize: '14px' 
            }} 
            verticalAlign="top" 
            align="right"
          />
          
          <Bar
            dataKey="promedio"
            fill="#00B2E3" // Color vibrante
            name="Promedio de Resultados"
            barSize={barSize}
            radius={[8, 8, 0, 0]} // Bordes más redondeados
            shape={<CustomBar fill="#00B2E3" />} 
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default IndicadoresReport;

