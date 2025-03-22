import React, { useState } from 'react';
import { Box} from '@mui/material';
import PlanControlBarChart from '../Graficas/GraficaPlanControl';

const VistaAnalisisDatos = () => {
 

  return (
    <Box sx={{ p: 4 }}>
      {/* Gráfica original */}
      <PlanControlBarChart/>
    </Box>
  );
};

export default VistaAnalisisDatos;
