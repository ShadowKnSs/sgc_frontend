// ReportesDeProceso.jsx
import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Title from '../components/Title';
import ReportCard from '../components/CardReport';
import GenerateReportModal from '../components/Modals/GenerarReporteModal';
import FloatingActionButton from '../components/ButtonNewReport';
import axios from 'axios';

const ReportesDeProceso = () => {
  const [openModal, setOpenModal] = useState(false);
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState('');
  const [processes, setProcesses] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState('');
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [reportCard, setReportCard] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  // Función para obtener entidades (desde Laravel)
  const fetchEntities = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/entidades');
      console.log("Respuesta de entities:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching entities:", error);
      throw error;
    }
  };

  // Función para obtener procesos por entidad
  const fetchProcesses = async (entityId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/procesos/entidad/${entityId}`);
      console.log("Respuesta de processes:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching processes:", error);
      throw error;
    }
  };

  // Función para obtener años por proceso
  const fetchYears = async (processId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/registros/years/${processId}`);
      console.log("Respuesta de years:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching years:", error);
      throw error;
    }
  };
  
  // Cargar entidades al montar el componente
  useEffect(() => {
    fetchEntities()
      .then((data) => setEntities(data.entidades))
      .catch((error) => {
        setSnackbarMessage("Error al obtener entidades: " + error.message);
        setSnackbarOpen(true);
      });
  }, []);

  // Cuando se selecciona una entidad, cargar procesos
  useEffect(() => {
    if (selectedEntity) {
      fetchProcesses(selectedEntity)
        .then((data) => {
          console.log("Fetched processes:", data);
          setProcesses(Array.isArray(data) ? data : data.procesos);
        })
        .catch((error) => {
          setSnackbarMessage("Error al obtener procesos: " + error.message);
          setSnackbarOpen(true);
        });
    } else {
      setProcesses([]);
    }
    setSelectedProcess('');
    setYears([]);
    setSelectedYear('');
  }, [selectedEntity]);

  // Cuando se selecciona un proceso, cargar años
  useEffect(() => {
    if (selectedProcess) {
      fetchYears(selectedProcess)
        .then((data) => setYears(data))
        .catch((error) => {
          setSnackbarMessage("Error al obtener años: " + error.message);
          setSnackbarOpen(true);
        });
    } else {
      setYears([]);
    }
    setSelectedYear('');
  }, [selectedProcess]);

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEntity('');
    setSelectedProcess('');
    setSelectedYear('');
  };

  // Al guardar, convertir y buscar la entidad y el proceso con las propiedades correctas:
  const handleGuardar = () => {
    if (!selectedEntity || !selectedProcess || !selectedYear) {
      setSnackbarMessage('Por favor, seleccione todos los campos.');
      setSnackbarOpen(true);
      return;
    }
    // Convertir a número para comparar
    const entity = entities.find((e) => e.idEntidadDependecia === Number(selectedEntity));
    const process = processes.find((p) => p.idProceso === Number(selectedProcess));
    console.log("Guardando reportCard con:", {
      processId: Number(selectedProcess),
      year: selectedYear,
    });

    const newReportCard = {
      processId: Number(selectedProcess), // Guardar ID del proceso
      year: selectedYear, // Guardar Año seleccionado
      entityName: entity ? entity.nombreEntidad : '',
      processName: process ? process.nombreProceso : '',
    };

    // axios.post('http://localhost:8000/api/reporte-proceso', {
    //   idProceso: newReportCard.processId,
    //   nombreReporte: `Reporte ${newReportCard.processName}`,
    //   fechaElaboracion: new Date().toISOString().slice(0, 10) // formato yyyy-mm-dd
    // })
    // .then(() => {
    //   console.log("✅ Reporte guardado correctamente");
    // })
    // .catch(err => {
    //   console.error("❌ Error al guardar el reporte:", err);
    //   setSnackbarMessage("Error al guardar el reporte");
    //   setSnackbarOpen(true);
    // });

    
    setReportCard(newReportCard);
    setOpenModal(false);
    setSelectedEntity('');
    setSelectedProcess('');
    setSelectedYear('');

  };
  
  const handleCardClick = () => {
    if (!reportCard) return;
  
    const { processId, year } = reportCard;
    console.log("🔍 ID Proceso:", processId);
    console.log("🔍 Año:", year);
  
    navigate(`/reporte-proceso/${processId}/${year}`); // Redirigir a la nueva vista
  };
  

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Box sx={{ p: 2, position: 'relative', minHeight: '100vh' }}>
      <Box sx={{ textAlign: "center", paddingTop: 3 }}>
        <Title text="Reportes de Proceso" />
      </Box>

      {reportCard && <ReportCard report={reportCard} onClick={handleCardClick} />}

      <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <FloatingActionButton onClick={handleOpenModal} />
      </Box>

      <GenerateReportModal
        open={openModal}
        onClose={handleCloseModal}
        onSave={handleGuardar}
        entities={entities}
        processes={processes}
        years={years}
        selectedEntity={selectedEntity}
        selectedProcess={selectedProcess}
        selectedYear={selectedYear}
        setSelectedEntity={setSelectedEntity}
        setSelectedProcess={setSelectedProcess}
        setSelectedYear={setSelectedYear}
      />

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReportesDeProceso;
