// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#458cd4' },
    secondary: { main: '#2dc1df' },
    terciary: { main: '#F9B800' },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    // Ejemplo: configuración global de botones
    MuiButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
  },
});

export default theme;
