// 📁 src/components/Loader.jsx
import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

const Loader = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="40vh">
      <CircularProgress size={60} thickness={5} />
      <Typography variant="subtitle1" mt={2}>
        Cargando roles disponibles...
      </Typography>
    </Box>
  );
};

export default Loader;
