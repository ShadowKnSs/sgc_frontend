// src/components/Graficas/CircularProgressIndicator.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CircularProgressIndicator = ({ label, value, color }) => {
  return (
    <Box sx={{ width: 150, mx: "auto" }}>
      <CircularProgressbar 
        value={value} 
        text={`${value}%`} 
        styles={buildStyles({
          textSize: '16px',
          pathColor: color,       // Usamos el color pasado por prop
          textColor: '#000',
          trailColor: '#d6d6d6'
        })}
      />
      <Typography variant="subtitle1" align="center" sx={{ mt: 1 }}>
        {label}
      </Typography>
    </Box>
  );
};

export default CircularProgressIndicator;
