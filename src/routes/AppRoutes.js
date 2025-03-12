import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import HomePage from "../views/welcome";
import ProcessPage from "../views/processList";
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
import Seguimiento from "../views/seguimiento";
import FormularioSeguimiento from "../views/formularioSeguimiento";
import Archivos from "../views/archivosSeg";
import ProcessInEntity from "../views/processInEntity";
import SeguimientoPrincipal from "../views/seguimientoPrincipal";
import AdminEventos from "../views/adminEventNot";
import AdminIndicatorPage from "../views/adminIndicadoresPage";
import UserIndicatorPage from "../views/userIndicadoresPage";
import UserEvent from "../views/userEventNot";
import CarpetasActividadMejora from "../views/carpetasActividadMejora";


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="procesos" element={<ProcessPage />} />
          <Route path="nuevo-proceso" element={<NewProcess />} />
          <Route path="editar-proceso/:idProceso" element={<EditProcess />} />
          <Route path="/admin-indicadores" element={<AdminIndicatorPage />} />
          <Route path="/user-indicadores" element={<UserIndicatorPage />} />
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
          {/* <Route path="actividad-mejora/idPlanCorrectivo" element={<ActividadMejora />} /> */}
          <Route path="actividad-mejora" element={<ActividadMejora />} />
          <Route path="seguimiento/:idProceso" element={<Seguimiento />} />
          {/*<Route path="formulario-seguimiento" element={<FormSeguimiento />} />*/}
          <Route path="/archivosSeg/:nombreCarpeta" element={<Archivos />} />
          <Route path="user-eventos" element={<UserEvent />} />
          <Route path="admin-eventos" element={<AdminEventos />} />
          <Route path="manual-operativo" element={<ManualOperativo />} />
          <Route path="/procesos/:idEntidad" element={<ProcessInEntity />} />
          <Route path="seguimientoPrincipal/:idRegistro" element={<SeguimientoPrincipal />} />
          <Route path="carpeta-ActividadMejora/:idProceso" element={<CarpetasActividadMejora />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
