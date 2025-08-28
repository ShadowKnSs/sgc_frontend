/**
 * Componente: AdminHome
 * Descripción:
 * Vista principal del panel administrativo para gestionar contenido informativo del sistema.
 * Permite al usuario alternar entre tres secciones clave:
 * - Noticias
 * - Eventos
 * - Avisos

 * Funcionalidades:
 * 1.  Usa `Tabs` de Material UI para navegar entre secciones sin redirección.
 * 2.  Renderiza dinámicamente los componentes:
 *    - `AdminNewsList` para gestión de noticias.
 *    - `AdminEAList` reutilizado tanto para eventos como para avisos, según la prop `tipo`.
 * 3.  Presenta un título centralizado mediante el componente `Title`.

 * Estado:
 * - `tabValue`: controla qué pestaña está activa y qué vista se renderiza.

 * Componentes utilizados:
 * - `Title`: muestra el encabezado principal estilizado.
 * - `AdminNewsList`: lista de noticias con opciones para administrar.
 * - `AdminEAList`: lista reutilizable para eventos y avisos (`tipo="Evento"` o `"Aviso"`).

 * Diseño:
 * - Utiliza `Box` y `Tabs` de Material UI para una disposición limpia y responsive.
 * - Las vistas se renderizan condicionalmente de acuerdo a la pestaña activa.

 * Buenas prácticas aplicadas:
 * -  Separación de vistas mediante componentes reutilizables.
 * -  Uso claro de `useState` para navegación local sin recargar.
 * -  Reutilización de `AdminEAList` para evitar duplicación de código.

 * Posibles mejoras:
 * - [ ] Añadir contadores o badges con cantidad de elementos por pestaña.
 * - [ ] Incorporar búsqueda o filtrado por fecha/autor/estado.
 * - [ ] Indicar si hay contenido nuevo no leído o no publicado.
 */
import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import AdminNewsList from '../components/AdminNewsList';
import AdminEAList from '../components/AdminEAlist';
import Title from '../components/Title';
import BreadcrumbNav from "../components/BreadcrumbNav";



const AdminHome = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <BreadcrumbNav items={[{ label: "Gestión de Noticias", icon: NewspaperIcon }]} />

      <Title text="Gestión de Noticias/Eventos/Avisos"></Title>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ paddingBottom: 3 }}>
        <Tab label="Noticias" />
        <Tab label="Eventos" />
        <Tab label="Avisos" />
      </Tabs>

      {tabValue === 0 && <AdminNewsList />}
      {tabValue === 1 && <AdminEAList tipo="Evento" />}
      {tabValue === 2 && <AdminEAList tipo="Aviso" />}
    </Box>
  );
};

export default AdminHome;
