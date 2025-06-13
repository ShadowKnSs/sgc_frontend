/**
 * Componente: ProcessView
 * Descripción:
 * Vista principal del módulo "Acciones de Mejora". 
 * Muestra tres secciones clave: Plan de Acción Correctivo, Plan de Trabajo y Proyecto de Mejora.
 * Incluye navegación por pestañas, contexto del proceso y validación de permisos.

 * Props: 
 * - No recibe props directamente. Usa `useParams` y `location.state`.

 * Hooks:
 * - useParams: para obtener el `idRegistro` desde la URL.
 * - useLocation: para extraer `idProceso`, `rolActivo`, y permisos desde el `state` o localStorage.
 * - useState: para manejar pestañas activas, datos del proceso, etc.
 * - useEffect: para cargar el `idProceso` si no está definido, consultando a la API con el `idRegistro`.

 * Subcomponentes Renderizados:
 * - `PlanCorrectivoContainer`: para acciones correctivas.
 * - `PlanTrabajo`: para planes operativos del proceso.
 * - `ProyectoMejoraContainer`: para proyectos de mejora continua.
 * - `ContextoProcesoEntidad`: muestra nombre de la entidad y proceso.
 * - `MenuNavegacionProceso`: navegación lateral relacionada al proceso.

 * Funcionalidades:
 * 1.  Validación de permisos (`soloLectura`, `puedeEditar`) desde el hook `Permiso`.
 * 2.  Navegación entre secciones con animación y estilos personalizados.
 * 3.  Carga dinámica del `idProceso` si no está disponible (a partir de `idRegistro`).
 * 4.  Uso de localStorage como fallback si `location.state` no incluye los datos necesarios.
 * 5.  Diseño responsive y adaptable con scroll horizontal en la barra de navegación.

 * Buenas prácticas:
 * - Separación de lógica de renderizado (`renderContent`) de la estructura visual.
 * - Uso de un arreglo `sections` para evitar duplicación en el manejo de pestañas.
 * - Consulta condicional de datos (`fetchProceso`) para optimizar llamadas a la API.

 * Recomendaciones futuras:
 * - Implementar la función `scrollNav()` para desplazar la barra de navegación horizontal en pantallas pequeñas.
 * -  Agregar feedback visual al cambiar de pestaña (como un pequeño indicador animado).
 * -  Extraer las secciones a componentes separados si el número de vistas crece.

 */

import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Box, Container, Button, CircularProgress } from "@mui/material";
import PlanCorrectivoContainer from "../components/PlanCorrectivoContainer"; // Asegúrate de la ruta correcta
// import FormProyMejora from "../components/Forms/FormProyMejora";
// import ProyectosMejoraCards from "../components/ProyectoMejoraCards";
import ProyectoMejoraContainer from "../components/ProyectoMejoraContainer"; // asegúrate de importar correctamente

import PlanTrabajo from "../views/planTrabajoForm";
import ContextoProcesoEntidad from "../components/ProcesoEntidad";
import MenuNavegacionProceso from "../components/MenuProcesoEstructura";
import useMenuProceso from "../hooks/useMenuProceso";
import Permiso from "../hooks/userPermiso";
import axios from 'axios';


const ProcessView = () => {
  // Recibimos parámetros de la URL: por ejemplo, idRegistro y title
  const { idRegistro } = useParams();
  const location = useLocation();
  const rolActivo = location.state?.rolActivo || JSON.parse(localStorage.getItem("rolActivo"));
  const { soloLectura, puedeEditar } = Permiso("Acciones de Mejora");
  const menuItems = useMenuProceso();
  const [selectedTab, setSelectedTab] = useState(0);
  const sections = [
    "Plan de Acción Correctivo",
    "Plan de Trabajo",
    "Proyecto de Mejora",
  ];
  const [datosProceso, setDatosProceso] = useState({ idProceso: null, anio: null });
  const [loadingProceso, setLoadingProceso] = useState(true);


  useEffect(() => {
    const fetchProceso = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/getIdRegistro`, {
          params: { idRegistro }
        });
        if (response.data?.proceso?.idProceso) {
          setDatosProceso({
            idProceso: response.data.proceso.idProceso,
            anio: response.data.anio
          });
        }
      } catch (error) {
        console.error("Error al obtener el idProceso desde idRegistro:", error);
      } finally {
        setLoadingProceso(false);
      }
    };

    if (idRegistro) fetchProceso();
  }, [idRegistro]);

  if (loadingProceso) {
    return <Box sx={{ textAlign: "center", mt: 4 }}><CircularProgress /></Box>;
  }

  const renderContent = () => {
    switch (sections[selectedTab]) {
      case "Plan de Acción Correctivo":
        return <PlanCorrectivoContainer idProceso={datosProceso.idProceso} soloLectura={soloLectura} puedeEditar={puedeEditar} />;
      case "Plan de Trabajo":
        return (
          <Box>
            <PlanTrabajo idRegistro={idRegistro} soloLectura={soloLectura} puedeEditar={puedeEditar} rolActivo={rolActivo}/>
          </Box>
        );
      case "Proyecto de Mejora":
        return (
          <ProyectoMejoraContainer
            idRegistro={idRegistro}
            soloLectura={soloLectura}
            puedeEditar={puedeEditar}
          />
        );
      default:
        return <h2>Seleccione una opción</h2>;
    }
  };


  return (
    <Container maxWidth="xl">
      {datosProceso.idProceso && (
        <Box sx={{ marginTop: 2 }}>
          <ContextoProcesoEntidad idProceso={datosProceso.idProceso} />
        </Box>

      )}
      <MenuNavegacionProceso items={menuItems} />

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", my: 2 }}>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            p: 1,
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
            mb: 3,
            flexWrap: "wrap"
          }}
        >
          {sections.map((section, index) => (
            <Button
              key={index}
              onClick={() => setSelectedTab(index)}
              disableElevation
              sx={{
                px: 3,
                py: 1.5,
                fontSize: "0.95rem",
                fontWeight: selectedTab === index ? "bold" : "normal",
                borderRadius: "8px",
                textTransform: "none",
                color: selectedTab === index ? "#fff" : "#185FA4",
                backgroundColor: selectedTab === index ? "#68A2C9" : "#ffffff",
                border: selectedTab === index ? "none" : "1px solid #185FA4",
                boxShadow: selectedTab === index ? "0px 4px 10px rgba(24, 95, 164, 0.3)" : "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: selectedTab === index ? "#68A2DA" : "#f0f6fc",
                }
              }}
            >
              {section}
            </Button>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          padding: "5px",
          minHeight: "500px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: "auto",
          backgroundColor: "white",
          textAlign: "center",
          borderRadius: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          transition: "all 0.3s ease-in-out"
        }}
      >
        {renderContent()}
      </Box>
    </Container>
  );
};

export default ProcessView;
