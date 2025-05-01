import { useEffect, useState } from "react";
import axios from "axios";

const useProcesoEntidad = (idRegistro) => {
  const [info, setInfo] = useState({ proceso: "", entidad: "", loading: true, error: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get(`http://127.0.0.1:8000/api/registro-info/${idRegistro}`);
        setInfo({
          proceso: resp.data.proceso,
          entidad: resp.data.entidad,
          loading: false,
          error: null
        });
      } catch (err) {
        setInfo({ proceso: "", entidad: "", loading: false, error: "Error al obtener datos" });
      }
    };

    if (idRegistro) fetchData();
  }, [idRegistro]);

  return info;
};

export default useProcesoEntidad;
