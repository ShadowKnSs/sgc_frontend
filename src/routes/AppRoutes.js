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
import ManualOperativo from "../views/operationalManual";
import Entity from "../views/entity";
import UserManagement from "../views/usersList";
import ActividadMejora from "../views/actividadMejora";
import Seguimiento from "../views/seguimiento";
import FormSeguimiento from "../views/formularioSeguimiento";
import Archivos from "../views/archivosSeg";

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
          <Route path="editar-proceso/:idProceso" element={<EditProcess />} />
          <Route path="indicadores" element={<IndicatorPage userType={userType} />}/>
          <Route path="graficas" element={<GraficasPage />} />
          <Route path="gestion-riesgos" element={<GestionRiesgos />} />
          <Route path="archivos/:year" element={<FilesGestRiesgos />} />
          <Route path="estructura-procesos" element={<EstructuraProcesos />}/>
          <Route path="operational-manual" element={<ManualOperativo />}/>
          <Route path="entidades" element={<Entity />}/>
          <Route path="usuarios" element={<UserManagement />} />
          <Route path="actividad-mejora" element={<ActividadMejora />} />
          <Route path="seguimiento" element={<Seguimiento />} />
          <Route path="formulario-seguimiento" element={<FormSeguimiento />} />
          <Route path="/archivosSeg/:nombreCarpeta" element={<Archivos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
