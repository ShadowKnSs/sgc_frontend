import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePage from '../views/welcome';
import ProcessPage from '../views/processList';
import IndicatorPage from '../views/indicadores';
  // Datos de ejemplo para los indicadores
  
const AppRoutes = () => {
    const [indicators, setIndicators] = useState([
        { id: 1, name: "Indicador de Calidad" },
        { id: 2, name: "Indicador de Desempeño" },
      ]);
    
      // Define el tipo de usuario: 'admin' o 'user'
      const userType = "admin"; // Cambia a 'user' para ver el comportamiento del otro usuario
    
      const handleEdit = (id) => {
        console.log("Editar indicador", id);
        // Aquí implementarías la lógica para editar el indicador
      };
    
      const handleDelete = (id) => {
        console.log("Eliminar indicador", id);
        // Aquí implementarías la lógica para eliminar el indicador
        setIndicators(indicators.filter((ind) => ind.id !== id));
      };
    
      const handleResultRegister = (id, result) => {
        console.log("Resultado registrado para indicador", id, result);
        // Aquí podrías actualizar el estado o enviar el resultado a la API
      };
    
      const handleAddIndicator = () => {
        console.log("Agregar nuevo indicador");
        // Lógica para agregar un nuevo indicador (por ejemplo, abrir un modal o simplemente agregar uno nuevo)
        const newIndicator = { id: Date.now(), name: "Nuevo Indicador" };
        setIndicators([...indicators, newIndicator]);
      };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="procesos" element={<ProcessPage />} />
          <Route path="indicadores" element={<IndicatorPage indicators={indicators} 
      userType={userType} 
      onEdit={handleEdit}
      onDelete={handleDelete}
      onResultRegister={handleResultRegister}
      onAddIndicator={handleAddIndicator}/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
