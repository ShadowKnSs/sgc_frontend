import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import { ProtectedRoute } from "../auth/guards"; // <-- importa la guarda
import HomePage from "../views/welcome";
import ProcessPage from "../views/processList";
import GraficasPage from "../views/graficasIndicadores";
import NewProcess from "../views/newProcess";
import EditProcess from "../views/editProcess";
// import FilesGestRiesgos from "../views/filesGestRiesgos";
import EstructuraProcesos from "../views/procesStructure";
// import AnalisisDatos from "../views/analisisDatos";
import ManualOperativo from "../views/operationalManual";
import Entity from "../views/entity";
import UserManagement from "../views/usersList";
import PlanTrabajoForm from "../views/planTrabajoForm";
import FormularioAnalisis from "../views/analisisDatosForm";
import GestionRiesgosForm from "../views/gestionRiegosForm";
import ActividadMejora from "../views/actividadMejora";
import Carpetas from "../views/seguimiento";
// import Archivos from "../views/archivosSeg";
import AdminEventos from "../views/adminEventNot";
import InformeAuditoria from "../views/informeAuditoriaInterna";
import Cronograma from "../views/cronograma";
import ManualCalidad from "../views/manualCalidad";
import ProcessInEntity from "../views/processInEntity";
import SeguimientoPrincipal from "../views/seguimientoPrincipal";
import UnifiedIndicatorPage from "../views/userIndicadoresPage";
import UserEvent from "../views/userEventNot";
import InformeAuditoriaInterna from "../views/informeAuditoriaInterna";
import ReportesAuditoria from "../views/reportesAuditoria";
import VistaPreviaAud from "../views/vistaPreviaInformeAuditoria";
import ManualDelSitio from "../views/manualSitio";
import TypesReports from "../views/typesReports";
import PrincipalReportSem from "../views/principalReportSem";
import ReporteSemestral from "../views/reporteSemestral";
import ListaReportesProceso from "../views/listReportesProceso";
import Formatos from "../views/formatos";
import BuscaReportes from "../views/buscaReportes";
import GestionEntidades from "../views/gestionEntidades";
import BuscaSupervisor from "../views/buscaSupervisor";
import AuditoriaProceso from "../views/auditoriaProceso";
// import AuthInstitucional from "../components/AuthInstitucional";

//Pruebas
// import ModalError from "../components/Modals/ErrorInicioSesion";
import Auditores from "../views/auditores";

import Login from "../views/login";
import SeleccionarRol from "../views/seleccionarRol";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas principales bajo Layout */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>

         {/* Públicas (también pasan por ProtectedRoute pero están en PUBLIC_PATHS) */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="manual-calidad" element={<ManualCalidad />} />
          <Route path="user-eventos" element={<UserEvent />} />
          <Route path="seleccionarRol" element={<SeleccionarRol />} />
         

         {/* Privadas (el guard valida por rol) */}
         {/* ---------------------- */}
          {/* Gestión de Procesos y Entidades */}
          {/* ---------------------- */}
          <Route path="procesos" element={<ProcessPage />} />
          <Route path="procesos/:idEntidad" element={<ProcessInEntity />} />
          <Route path="nuevo-proceso" element={<NewProcess />} />
          <Route path="editar-proceso/:idProceso" element={<EditProcess />} />
          <Route path="gestion-entidades" element={<GestionEntidades />} />
          <Route path="entidades" element={<Entity />} />

{/* ---------------------- */}
          {/* Administrador */}
          {/* ---------------------- */}
                    <Route path="manualDelSitio" element={<ManualDelSitio />} />

          <Route path="usuarios" element={<UserManagement />} />
          <Route path="admin-eventos" element={<AdminEventos />} />
          <Route path="cronograma" element={<Cronograma />} />
          <Route path="typesReports" element={<TypesReports />} />
          <Route path="principalReportSem" element={<PrincipalReportSem />} />
          <Route path="listado-reportes-proceso" element={<ListaReportesProceso />} />
          <Route path="reportes-auditoria" element={<ReportesAuditoria />} />
          <Route path="formatos" element={<Formatos />} />
          <Route path="busca_supervisor" element={<BuscaSupervisor />} />
{/* ---------------------- */}
          {/* Estructura del proceso*/}
          {/* ---------------------- */}
                    <Route path="estructura-procesos/:idProceso" element={<EstructuraProcesos />} />

          <Route path="manual-operativo" element={<ManualOperativo />} />
          <Route path="manual-operativo/:idProceso" element={<ManualOperativo />} />

          <Route path="carpetas/:idProceso/:title" element={<Carpetas />} />
          <Route path="gestion-riesgos" element={<GestionRiesgosForm />} />
          <Route path="gestion-riesgos/:idRegistro" element={<GestionRiesgosForm />} />
          <Route path="analisis-datos" element={<FormularioAnalisis />} />
          <Route path="analisis-datos/:idRegistro" element={<FormularioAnalisis />} />
          <Route path="indicadores" element={<UnifiedIndicatorPage />} />
          <Route path="indicadores/:idProceso/:anio" element={<UnifiedIndicatorPage />} />
          <Route path="graficas" element={<GraficasPage />} />
          <Route path="graficas/:idRegistro" element={<GraficasPage />} />
          <Route path="actividad-mejora" element={<ActividadMejora />} />
          <Route path="actividad-mejora/:idRegistro" element={<ActividadMejora />} />
          <Route path="seguimientoPrincipal/:idRegistro/:idProceso" element={<SeguimientoPrincipal />} />

{/* ---------------------- */}
          {/* Auditorías */}
          {/* ---------------------- */}
          <Route path="auditores" element={<Auditores />} />
          <Route path="auditoria/:idRegistro" element={<AuditoriaProceso />} />
          <Route path="informe-auditoria" element={<InformeAuditoria />} />
          <Route path="auditorias/:id" element={<InformeAuditoriaInterna />} />
          <Route path="vista-previa/:idAuditorialInterna" element={<VistaPreviaAud />} />
          
          <Route path="plan-trabajoForm" element={<PlanTrabajoForm />} />
         
          <Route path="/reporteSemestral" element={<ReporteSemestral />} />
          
         
          <Route path="buscar" element={<BuscaReportes />} />
      
          <Route path="formatos" element={<Formatos />} />
          <Route path="cronograma" element={<Cronograma />} />
          <Route path="cronograma/:idProceso" element={<Cronograma />} />
          {/* <Route path="/auth-institucional" element={<AuthInstitucional />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
