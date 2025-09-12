import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Box, LinearProgress, FormHelperText
} from "@mui/material";
import CustomButton from "../Button";
import axios from "axios";

const API = "http://localhost:8000/api";

export default function GenerarReporteModal({
  open, onClose,
  defaultAnio = new Date().getFullYear(),
  onSave // ({ idProceso, anio, entidadNombre, procesoNombre })
}) {
  const [lista, setLista] = useState([]);       // [{ idProceso, nombreEntidad, nombreProceso, nombreCompleto }]
  const [idProceso, setIdProceso] = useState("");
  const [anio, setAnio] = useState(defaultAnio);

  const [years, setYears] = useState([]);       // años válidos según proceso
  const [loadingYears, setLoadingYears] = useState(false);
  const [yearsError, setYearsError] = useState("");

  useEffect(() => {
    if (!open) return;
    setIdProceso("");
    setAnio(defaultAnio);
    setYears([]);
    setYearsError("");

    // Traer procesos + entidad (1 sola llamada)
    axios.get(`${API}/procesos-con-entidad`)
      .then(({ data }) => setLista(data?.procesos || []))
      .catch(() => setLista([]));
  }, [open, defaultAnio]);

  // Cuando se selecciona un proceso → cargar años válidos
  useEffect(() => {
    if (!open || !idProceso) {
      setYears([]);
      setYearsError("");
      return;
    }

    setLoadingYears(true);
    setYearsError("");
    axios.get(`${API}/registros/years/${idProceso}`)
      .then(({ data }) => {
        const arr = Array.isArray(data) ? data : [];
        setYears(arr);
        // Elegir año por defecto:
        if (arr.length > 0) {
          // Preferimos el defaultAnio si existe; si no, el último (mayor)
          const next = arr.includes(Number(defaultAnio)) ? Number(defaultAnio) : Number(arr[arr.length - 1]);
          setAnio(next);
        } else {
          setAnio(""); // no hay años
        }
      })
      .catch(() => {
        setYears([]);
        setAnio("");
        setYearsError("No se pudieron cargar los años para el proceso seleccionado.");
      })
      .finally(() => setLoadingYears(false));
  }, [open, idProceso, defaultAnio]);

  const disable = !idProceso || !anio || loadingYears;

  const handleConfirm = () => {
    const p = lista.find(x => Number(x.idProceso) === Number(idProceso));
    const entidadNombre = p?.nombreEntidad || "";
    const procesoNombre = p?.nombreProceso || "";
    onSave?.({ idProceso: Number(idProceso), anio: Number(anio), entidadNombre, procesoNombre });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Generar reporte de proceso</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1, display: "grid", gap: 2 }}>
          <TextField
            select
            label="Proceso (Entidad — Proceso)"
            value={idProceso || ""}
            required
            onChange={e => setIdProceso(Number(e.target.value))}
          >
            {lista.map(item => (
              <MenuItem key={item.idProceso} value={item.idProceso}>
                {item.nombreCompleto || `${item.nombreEntidad} - ${item.nombreProceso}`}
              </MenuItem>
            ))}
          </TextField>

          {/* Loader al pedir años */}
          {loadingYears && <LinearProgress />}

          <TextField
            select
            label="Año"
            value={anio || ""}
            required
            disabled={!idProceso || loadingYears || years.length === 0}
            onChange={e => setAnio(Number(e.target.value))}
            helperText={years.length === 0 && idProceso && !loadingYears ? "Este proceso no tiene años disponibles." : ""}
          >
            {years.map(a => <MenuItem key={a} value={a}>{a}</MenuItem>)}
          </TextField>

          {!!yearsError && <FormHelperText error>{yearsError}</FormHelperText>}
        </Box>
      </DialogContent>
      <DialogActions>
        <CustomButton type="cancelar" variant="outlined" onClick={onClose}>Cancelar</CustomButton>
        <CustomButton type="guardar" onClick={handleConfirm} disabled={disable}>Generar</CustomButton>
      </DialogActions>
    </Dialog>
  );
}
