/**
 * Hook: useProcesoEntidadPorProceso
 * Descripción:
 * Custom hook que permite obtener la información relacionada a un proceso y su entidad correspondiente,
 * a partir del `idProceso`. Esta información se obtiene desde el backend mediante una petición HTTP GET.

 * Parámetros:
 * - idProceso (number | string): Identificador del proceso a consultar. Si no se proporciona, el hook no ejecuta la petición.

 * Retorna:
 * - info (object): Objeto con la siguiente estructura:
 *   - proceso (string): Nombre del proceso recuperado.
 *   - entidad (string): Nombre de la entidad asociada.
 *   - loading (boolean): `true` mientras se realiza la solicitud.
 *   - error (string | null): Mensaje de error si la solicitud falla.

 * Ejemplo de uso:
 * ```js
 * const { proceso, entidad, loading, error } = useProcesoEntidadPorProceso(idProceso);
 *
 * if (loading) return <Spinner />;
 * if (error) return <Error message={error} />;
 * return <p>{proceso} - {entidad}</p>;
 * ```

 * Funcionamiento Interno:
 * - Usa `useEffect` para hacer la petición `GET` a `http://localhost:8000/api/proceso-entidad/:idProceso`
 *   cada vez que `idProceso` cambia.
 * - Maneja los estados `loading` y `error` para facilitar el control de UI en el componente que lo consume.

 * Consideraciones:
 * - Este hook se asegura de no ejecutar la petición si `idProceso` es `null` o `undefined`.
 * - Se recomienda utilizarlo dentro de componentes funcionales React.
 * - La URL del backend está hardcodeada; se recomienda eventualmente centralizarla o usar una variable de entorno.

 * Mejora recomendada:
 *  Agregar soporte para cancelación de solicitud (`AbortController`) si el componente se desmonta antes de completarse.
 */
import { useEffect, useState } from "react";
import axios from "axios";

const useProcesoEntidadPorProceso = (idProceso) => {
  const [info, setInfo] = useState({ proceso: "", entidad: "", loading: true, error: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get(`http://127.0.0.1:8000/api/proceso-entidad/${idProceso}`);
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

    if (idProceso) fetchData();
  }, [idProceso]);

  return info;
};

export default useProcesoEntidadPorProceso;
