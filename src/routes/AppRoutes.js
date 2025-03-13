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
import Entity from "../views/entity";
import UserManagement from "../views/usersList";
import PlanTrabajoForm from "../views/planTrabajoForm";
import FormularioAnalisis from "../views/analisisDatosForm";
import GestionRiesgosForm from "../views/gestionRiegosForm";
import ActividadMejora from "../views/actividadMejora";
import Carpetas from "../views/seguimiento";
import FormularioSeguimiento from "../views/formularioSeguimiento";
import Archivos from "../views/archivosSeg";
import EventosNotAv from "../views/eventNotAv";
import AdminEventos from "../views/adminEventos";
import ProcessInEntity from "../views/processInEntity";
import SeguimientoPrincipal from "../views/seguimientoPrincipal";
import ManualDelSitio from "../views/manualSitio";

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
          <Route path="indicadores" element={<IndicatorPage userType={userType} />} />
          <Route path="graficas" element={<GraficasPage />} />
          <Route path="gestion-riesgos" element={<GestionRiesgos />} />
          <Route path="archivos/:year" element={<FilesGestRiesgos />} />
          <Route path="estructura-procesos/:idProceso" element={<EstructuraProcesos />} />
          <Route path="analisis-Datos" element={<AnalisisDatos />} />
          <Route path="entidades" element={<Entity />} />
          <Route path="usuarios" element={<UserManagement />} />
          <Route path="plan-trabajoForm" element={<PlanTrabajoForm />} />
          <Route path="analisis-DatosForm" element={<FormularioAnalisis />} />
          <Route path="gestion-riesgosForm" element={<GestionRiesgosForm />} />
          <Route path="actividad-mejora" element={<ActividadMejora />} />
          <Route path="carpetas/:idProceso/:title" element={<Carpetas />} />
          {/*<Route path="formulario-seguimiento" element={<FormSeguimiento />} />*/}
          <Route path="/archivosSeg/:nombreCarpeta" element={<Archivos />} />
          <Route path="eventos" element={<EventosNotAv />} />
          <Route path="admin-eventos" element={<AdminEventos />} />
          <Route path="manual-operativo" element={<ManualOperativo />} />
          <Route path="/procesos/:idEntidad" element={<ProcessInEntity />} />
          <Route path="seguimientoPrincipal/:idRegistro" element={<SeguimientoPrincipal />} />
          <Route path="manualDelSitio" element={<ManualDelSitio />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
