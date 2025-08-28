import { Box, Paper, Typography } from "@mui/material";

export default function LoginLayout({ children }) {
  return (
    <Box display="flex" minHeight="100vh" justifyContent="center" alignItems="center" bgcolor="#DFECDF">
      <Paper elevation={6} sx={{ display: 'flex', width: '90%', maxWidth: 1000, borderRadius: 4, overflow: 'hidden', height: 500 }}>
        {/* Columna izquierda: Branding */}
        <Box flex={1} bgcolor="#ffffff" p={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Box display="flex" width="100%" alignItems="center" justifyContent="space-between">
            <Box flex={1} textAlign="center">
              <img
                src="https://admincongresos.uaslp.mx//Informacion/Patrocinadores/191.jpg"
                alt="Logo UASLP"
                width={200}
              />
            </Box>
            <Box width="1px" bgcolor="#0D47A1" height="100px" mx={2} />
            <Box flex={1} textAlign="center">
              <Typography sx={{ fontWeight: "bold", fontSize: "3rem", color: "#0D47A1", mb: -2 }}>
                DIGC
              </Typography>
              <Typography variant="subtitle2" color="#0D47A1">
                Dirección Institucional de Gestión de Calidad
              </Typography>
            </Box>
          </Box>
          <Typography variant="h4" color="#0D47A1" fontWeight="bold" mt={6}>
            ¡Hola, bienvenidos!
          </Typography>
        </Box>

        {/* Columna derecha: Login dinámico */}
        <Box flex={1} bgcolor="#185FA4" color="white" p={4} display="flex" flexDirection="column" justifyContent="center">
          {children}
        </Box>
      </Paper>
    </Box>
  );
}
