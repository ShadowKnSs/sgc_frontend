/**
 * Componente: BuscaReportes
 * Ubicación: src/views/BuscaReportes.jsx
 * Descripción:
 * Vista que permite al usuario buscar reportes ya generados del sistema, 
 * filtrando por tipo: auditorías o procesos.

 * Funcionalidades principales:
 * 1.  Muestra dos botones para seleccionar el tipo de búsqueda: "Buscar Auditorías" o "Buscar Procesos".
 * 2.  Al hacer clic en cada botón, se abre un modal correspondiente:
 *    - <BuscadorAuditoria /> para auditorías.
 *    - <BuscadorProcesos /> para procesos.
 * 3.  Controla la visibilidad de los buscadores con los estados `openAuditoriaSearch` y `openProcesoSearch`.
 * 4.  Usa el estado `searchTerm` y `setSearchTerm` para manejar el término de búsqueda compartido entre ambos buscadores.

 * Estados:
 * - `openAuditoriaSearch`: booleano que indica si está abierto el modal para buscar auditorías.
 * - `openProcesoSearch`: booleano que indica si está abierto el modal para buscar procesos.
 * - `searchTerm`: string que guarda el texto ingresado por el usuario para buscar.

 * Reutiliza:
 * - `Title`: para el encabezado estilizado.
 * - `BuscadorAuditoria`: componente modal personalizado para búsqueda de reportes de auditoría.
 * - `BuscadorProcesos`: componente modal personalizado para búsqueda de reportes de procesos.

 * UI y Diseño:
 * - Estructura centrada usando `Grid` de Material UI.
 * - Botones grandes y accesibles con buen padding.
 * - Compatibilidad responsive en dispositivos pequeños (xs, sm, md).
 * - Integración visual con los colores primarios y secundarios institucionales.

 * Recomendaciones futuras:
 * - Mostrar directamente los resultados debajo del buscador sin modal si se desea mejor UX.
 * - Agregar animaciones de entrada para los modales.
 * - Sincronizar `searchTerm` con resultados previos o historial reciente de búsqueda.

 * Dependencias externas:
 * - @mui/material
 * - React hooks (`useState`)
 */

import React, { useState } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import Title from '../components/Title';
import BuscadorAuditoria from '../components/buscadorAuditoria';
import BuscadorProcesos from '../components/buscadorProceso'; 

const BuscaReportes = () => {
  const [openAuditoriaSearch, setOpenAuditoriaSearch] = useState(false);
  const [openProcesoSearch, setOpenProcesoSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenAuditoriaSearch = () => {
    setOpenAuditoriaSearch(true);
  };

  const handleOpenProcesoSearch = () => {
    setOpenProcesoSearch(true);
  };

  const handleCloseSearch = () => {
    setOpenAuditoriaSearch(false);
    setOpenProcesoSearch(false);
  };

  return (
    <Box sx={{ p: 2, position: 'relative', minHeight: '100vh' }}>
      <Box sx={{ textAlign: "center", paddingTop: 3 }}>
        <Title text="Buscar Reportes" />
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Seleccione el tipo de reporte que desea buscar
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mt: 4, justifyContent: 'center' }}>
        <Grid item xs={12} sm={6} md={4}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleOpenAuditoriaSearch}
            fullWidth
            sx={{ py: 3 }}
          >
            Buscar Auditorías
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleOpenProcesoSearch}
            fullWidth
            sx={{ py: 3 }}
          >
            Buscar Procesos
          </Button>
        </Grid>
      </Grid>

      <BuscadorAuditoria
        open={openAuditoriaSearch}
        onClose={handleCloseSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <BuscadorProcesos
        open={openProcesoSearch}
        onClose={handleCloseSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </Box>
  );
};

export default BuscaReportes;