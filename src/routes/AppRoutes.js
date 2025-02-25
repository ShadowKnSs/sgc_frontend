import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import HomePage from "../views/welcome";
import ProcessPage from "../views/processList";
import IndicatorPage from "../views/indicadores";
import GraficasPage from "../views/graficasIndicadores";
import NewProcess from "../views/newProcess";
import EditProcess from "../views/editProcess";
import GestionRiesgos from "../views/gestionRiesgos";
import FilesGestRiesgos from "../views/filesGestRiesgos";
import EstructuraProcesos from "../views/procesStructure";
import AnalisisDatos from "../views/analisisDatos";
import ManualOperativo from "../views/operationalManual";

const AppRoutes = () => {
  // Define el tipo de usuario: 'admin' o 'user'
  const userType = "user"; // Cambia a 'user' para probar el otro rol

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="procesos" element={<ProcessPage />} />
          <Route path="nuevo-proceso" element={<NewProcess />} />
          <Route path="editar-proceso/:id" element={<EditProcess />} />
          <Route path="indicadores" element={<IndicatorPage userType={userType} />}/>
          <Route path="graficas" element={<GraficasPage />} />
          <Route path="gestion-riesgos" element={<GestionRiesgos />} />
          <Route path="archivos/:year" element={<FilesGestRiesgos />} />
          <Route path="estructura-procesos" element={<EstructuraProcesos />}/>
          <Route path="analisis-Datos" element={<AnalisisDatos />}/>
          <Route path="operational-manual" element={<ManualOperativo />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
