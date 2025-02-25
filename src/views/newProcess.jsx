import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ProcessForm from "../components/Forms/ProcesoForm";
import axios from "axios";

const NewProcess = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2002 }, (_, i) => 2003 + i);

  // Estados para almacenar datos de selects
  const [leaders, setLeaders] = useState([]);
  const [macroprocesos, setMacroprocesos] = useState([]);
  const [entidades, setEntidades] = useState([]);

  useEffect(() => {
    // Obtener líderes
    axios
      .get("http://127.0.0.1:8000/api/lideres")
      .then((response) => {
        setLeaders(response.data.leaders || []);
      })
      .catch((error) => {
        console.error("Error al obtener líderes:", error);
      });

    // Obtener macroprocesos
    axios
      .get("http://127.0.0.1:8000/api/macroprocesos")
      .then((response) => {
        setMacroprocesos(response.data.macroprocesos || []);
      })
      .catch((error) => {
        console.error("Error al obtener macroprocesos:", error);
      });

    // Obtener entidades/dependencias
    axios
      .get("http://127.0.0.1:8000/api/entidades")
      .then((response) => {
        setEntidades(response.data.entidades || []);
      })
      .catch((error) => {
        console.error("Error al obtener entidades:", error);
      });
  }, []);

  const handleSubmit = async (formData) => {
    try {
      await axios.post("http://127.0.0.1:8000/api/procesos", formData);
      navigate("/procesos");
    } catch (error) {
      console.error("Error al crear el proceso:", error);
      alert("Error al crear el proceso.");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <ProcessForm
        initialValues={{
          nombreProceso: "",
          idUsuario: "",
          objetivo: "",
          alcance: "",
          norma: "",
          idMacroproceso: "",
          estado: "",
          idEntidad: "",
          anioCertificado: "",
        }}
        leaders={leaders}
        macroprocesos={macroprocesos}
        entidades={entidades}
        years={years}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/procesos")}
        title="Nuevo Proceso"
      />
    </Box>
  );
};

export default NewProcess;
