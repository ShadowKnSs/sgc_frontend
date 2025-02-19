import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePage from '../views/welcome';
import ProcessPage from '../views/processList';
import IndicatorPage from '../views/indicadores';
import GraficasPage from '../views/graficasIndicadores';
import NewProcess from '../views/newProcess';



const AppRoutes = () => {
  // Define el tipo de usuario: 'admin' o 'user'
  const userType = "user"; // Cambia a 'user' para probar el otro rol

  return (
    <BrowserRouter>
      <Routes>
        < Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="procesos" element={<ProcessPage />} />
          <Route path="nuevo-proceso" element={<NewProcess />} />
          <Route path="indicadores" element={<IndicatorPage userType={userType} />} />
          <Route path="graficas" element={<GraficasPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
