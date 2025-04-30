import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import HomePage from "../views/welcome";
import ProcessPage from "../views/processList";
import GraficasPage from "../views/graficasIndicadores";
import NewProcess from "../views/newProcess";
import EditProcess from "../views/editProcess";
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
import Archivos from "../views/archivosSeg";
import AdminEventos from "../views/adminEventNot";
import InformeAuditoria from "../views/informeAditoriaInterna";
import Cronograma from "../views/cronograma";
import ManualCalidad from "../views/manualCalidad";
import ProcessInEntity from "../views/processInEntity";
import SeguimientoPrincipal from "../views/seguimientoPrincipal";
import AdminIndicatorPage from "../views/adminIndicadoresPage";
import UserIndicatorPage from "../views/userIndicadoresPage";
import UserEvent from "../views/userEventNot";
import InformeAuditoriaInterna from "../views/informeAuditoriaInterna";
import ReportesAuditoria from "../views/reportesAuditoria";
import VistaPreviaAud from "../views/vistaPreviaInformeAuditoria";
import ManualDelSitio from "../views/manualSitio";
import TypesReports from "../views/typesReports";
import PrincipalReportSem from "../views/principalReportSem";
import ReporteSemestral from "../views/reporteSemestral";
import ReporteProcesoPreview from "../views/reporteProceso";
import ListaReportesProceso from "../views/listReportesProceso";
import Formatos from "../views/formatos";
import BuscaReportes from "../views/buscaReportes";
import Login from "../views/login";
import SeleccionarRol from "../views/seleccionarRol";


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
          <Route path="user-indicadores/:idRegistro" element={<UserIndicatorPage />} />
          <Route path="user-indicadores" element={<UserIndicatorPage />} />
          <Route path="graficas" element={<GraficasPage />} />
          <Route path="graficas/:idRegistro" element={<GraficasPage />} />
          <Route path="archivos/:year" element={<FilesGestRiesgos />} />
          <Route path="estructura-procesos/:idProceso" element={<EstructuraProcesos />} />
          <Route path="analisis-Datos" element={<AnalisisDatos />} />
          <Route path="entidades" element={<Entity />} />
          <Route path="usuarios" element={<UserManagement />} />
          <Route path="plan-trabajoForm" element={<PlanTrabajoForm />} />
          <Route path="gestion-riesgos" element={<GestionRiesgosForm />} />
          <Route path="gestion-riesgos/:idRegistro" element={<GestionRiesgosForm />} />
          <Route path="actividad-mejora/:idRegistro" element={<ActividadMejora />} />
          <Route path="actividad-mejora" element={<ActividadMejora />} />
          <Route path="carpetas/:idProceso/:title" element={<Carpetas />} />
          {/*<Route path="formulario-seguimiento" element={<FormSeguimiento />} />*/}
          <Route path="/archivosSeg/:nombreCarpeta" element={<Archivos />} />
          <Route path="user-eventos" element={<UserEvent />} />
          <Route path="manual-operativo" element={<ManualOperativo />}/>
          <Route path="informe-auditoria" element={<InformeAuditoriaInterna />}/>
          <Route path="reportes-auditoria" element={<ReportesAuditoria />}/>
          <Route path="/auditorias/:id" element={<InformeAuditoriaInterna />} />
          <Route path="/vista-previa/:idAuditorialInterna" element={<VistaPreviaAud />} />
          <Route path="informe-auditoria" element={<InformeAuditoria />}/>
          <Route path="cronograma" element={<Cronograma />}/>
          <Route path="manual-calidad" element={<ManualCalidad />}/>
          <Route path="manual-operativo" element={<ManualOperativo />} />
          <Route path="manual-operativo/:idProceso" element={<ManualOperativo />} />
          <Route path="analisis-datos" element={<FormularioAnalisis />} />
          <Route path="analisis-datos/:idProceso/:anio" element={<FormularioAnalisis />} />
          <Route path="/procesos/:idEntidad" element={<ProcessInEntity />} />
          <Route path="seguimientoPrincipal/:idRegistro" element={<SeguimientoPrincipal />} />
          <Route path="manualDelSitio" element={<ManualDelSitio />} />
          <Route path="admin-eventos" element={<AdminEventos/>} />
          <Route path="user-eventos" element={<UserEvent/>} />
          {/* <Route path="carpeta-ActividadMejora/:idProceso" element={<CarpetasActividadMejora />} /> */}
          <Route path="actividad-mejora/:idRegistro" element={<ActividadMejora />} />
          <Route path="user-indicadores/:idRegistro" element={<UserIndicatorPage />} />
          <Route path="typesReports" element={<TypesReports/>} />
          <Route path="principalReportSem" element={<PrincipalReportSem/>} />
          <Route path="/reporteSemestral" element={<ReporteSemestral/>} />

          <Route path="/reporte-proceso/:idProceso/:year" element={<ReporteProcesoPreview />} />
          <Route path="reporte-proceso" element={<ReporteProcesoPreview />} />
          <Route path="listado-reportes-proceso" element={<ListaReportesProceso />} />

          <Route path="formatos" element={<Formatos />} />
          <Route path="buscar" element={<BuscaReportes />} />
          <Route path="login" element={<Login/>} />

          


          <Route path="seleccionarRol" element={<SeleccionarRol/>} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
