import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const GenerateReportModal = ({
  open,
  onClose,
  onSave,
  entities,
  processes,
  years,
  selectedEntity,
  selectedProcess,
  selectedYear,
  setSelectedEntity,
  setSelectedProcess,
  setSelectedYear
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Generar Reporte</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Selector de Entidad */}
          <FormControl fullWidth>
            <InputLabel id="entity-label">Entidad</InputLabel>
            <Select
              labelId="entity-label"
              value={selectedEntity || ""}
              label="Entidad"
              onChange={(e) => setSelectedEntity(e.target.value)}
            >
              {Array.isArray(entities) &&
                entities
                  .filter(entity => entity && entity.idEntidadDependencia !== undefined)
                  .map((entity) => (
                    <MenuItem
                      key={entity.idEntidadDependencia}
                      value={entity.idEntidadDependencia.toString()}
                    >
                      {entity.nombreEntidad}
                    </MenuItem>
                  ))
              }
            </Select>
          </FormControl>

          {/* Selector de Proceso */}
          <FormControl fullWidth disabled={!selectedEntity}>
            <InputLabel id="process-label">Proceso</InputLabel>
            <Select
              labelId="process-label"
              value={selectedProcess || ""}
              label="Proceso"
              onChange={(e) => setSelectedProcess(e.target.value)}
            >
              {Array.isArray(processes) &&
                processes
                  .filter(proc => proc && proc.idProceso !== undefined)
                  .map((proc) => (
                    <MenuItem key={proc.idProceso} value={proc.idProceso.toString()}>
                      {proc.nombreProceso}
                    </MenuItem>
                  ))
              }
            </Select>
          </FormControl>

          {/* Selector de Año */}
          <FormControl fullWidth disabled={!selectedProcess}>
            <InputLabel id="year-label">Año</InputLabel>
            <Select
              labelId="year-label"
              value={selectedYear || ""}
              label="Año"
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {Array.isArray(years) &&
                years
                  .filter((yr) => yr !== undefined && yr !== null)
                  .map((yr, index) => (
                    <MenuItem key={index} value={yr.toString()}>
                      {yr}
                    </MenuItem>
                  ))
              }
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={onSave} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenerateReportModal;
