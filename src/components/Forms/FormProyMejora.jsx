import React from "react";
import { Box, TextField, Stepper, Step, StepButton, StepContent, Snackbar, Alert , Typography} from "@mui/material";
import Title from "../Title";
import { useProyectoMejoraForm } from "../../hooks/useProyectoMejoraForm"
import CustomButton from "../../components/Button";

function ProyectoMejoraVertical({ soloLectura, puedeEditar }) {
  const formContext = useProyectoMejoraForm();

  if (!formContext || !formContext.formData) {
    return <Alert severity="error">Error: No se pudo cargar el formulario.</Alert>;
  }
  const {
    formData,
    activeStep,
    handleStep,
    handleNext,
    handleBack,
    handleChange,
    handleDynamicChange,
    addDynamicField,
    removeDynamicField,
    handleSubmit,
    snackbar,
    setSnackbar,
    erroresCampos
  } = formContext;

  const steps = [
    "Datos Generales",
    "Descripción de la Mejora",
    "Objetivos",
    "Información Complementaria",
    "Indicadores de Éxito",
    "Recursos",
    "Plan de Trabajo",
    "Aprobación"
  ];

  const maxChars = 255;
  const renderStepContent = (step) => {
    const disabled = soloLectura;
    const getError = (name) => erroresCampos[name] || false;
    const getHelper = (name) => getError(name) ? "Este campo es obligatorio" : "";

    switch (step) {
      case 0:
        return (
          <Box>
            <Typography
              variant="caption"
              sx={{ display: "block", textAlign: "right", color: "text.secondary" }}
            >
            </Typography>
            <TextField fullWidth label="División" name="division" value={formData.division} onChange={handleChange} margin="normal" inputProps={{ maxLength: 255 }} disabled={disabled} error={getError("division")} helperText={`${formData.division?.length || 0}/255`} />
            <Typography
              variant="caption"
              sx={{ display: "block", textAlign: "right", color: "text.secondary" }}
            >
            </Typography>
            <TextField fullWidth label="Departamento" name="departamento" value={formData.departamento} onChange={handleChange} margin="normal" inputProps={{ maxLength: 255 }} disabled={disabled} error={getError("departamento")} helperText={`${formData.departamento?.length || 0}/255`} />
            <TextField fullWidth label="Fecha" name="fecha" type="date" value={formData.fecha} onChange={handleChange} margin="normal" disabled={disabled} error={getError("fecha")} helperText={getHelper("fecha")} />
            <TextField
              fullWidth
              label="Número de Mejora"
              name="noMejora"
              type="number"
              value={formData.noMejora}
              onChange={handleChange}
              margin="normal"
              disabled={disabled}
              error={getError("noMejora")}
              helperText={getHelper("noMejora")}
              inputProps={{ min: 0 }}
            />
            <Typography
              variant="caption"
              sx={{ display: "block", textAlign: "right", color: "text.secondary" }}
            >
            </Typography>
            <TextField fullWidth label="Responsable" name="responsable" value={formData.responsable} onChange={handleChange} margin="normal" inputProps={{ maxLength: 255 }} disabled={disabled} error={getError("responsable")} helperText={`${formData.responsable?.length || 0}/255`} />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography
                variant="caption"
                sx={{ display: "block", textAlign: "right", color: "text.secondary" }}
              >
                {formData.descripcionMejora.length}/{maxChars}
             </Typography>
            <TextField fullWidth label="Descripción de la Mejora" name="descripcionMejora" value={formData.descripcionMejora} onChange={handleChange} margin="normal" multiline minRows={2} maxRows={6}  inputProps={{ maxLength: maxChars }} disabled={disabled} error={getError("descripcionMejora")} helperText={getHelper("descripcionMejora")} />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            {formData.objetivos.map((obj, index) => (
              <Box key={index} display="flex" alignItems="center">
                <TextField
                  key={index}
                  fullWidth
                  label={`Objetivo ${index + 1}`}
                  value={obj.descripcion}
                  onChange={(e) => handleDynamicChange("objetivos", index, "descripcion", e.target.value)}
                  margin="normal"
                  disabled={disabled}
                  error={getError(`objetivos.${index}.descripcion`)}
                  helperText={`${obj.descripcion?.length || 0}/255`}
                  inputProps={{ maxLength: 255 }}
                />
                {!soloLectura && puedeEditar && (
                  <CustomButton
                    type="cancelar"
                    onClick={() => removeDynamicField("objetivos", index)}
                  >
                    Eliminar
                  </CustomButton>
                )}
              </Box>
            ))}
            {!soloLectura && puedeEditar && (
              <CustomButton
                type="agregar"
                onClick={() => addDynamicField("objetivos", { descripcion: "" })}
              >
                Agregar Objetivo
              </CustomButton>
            )}
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ mt: 2 }}>
              <Typography
                  variant="caption"
                  sx={{ display: "block", textAlign: "right", color: "text.secondary" }}
                >
                  {formData.areaImpacto.length}/{maxChars}
              </Typography>
            <TextField fullWidth label="Área de Impacto" name="areaImpacto" value={formData.areaImpacto} onChange={handleChange} margin="normal" multiline rows={6} inputProps={{ maxLength: maxChars }} disabled={disabled} error={getError("areaImpacto")} helperText={getHelper("areaImpacto")} />
            </Box>

              <TextField fullWidth label="Personal Beneficiado" name="personalBeneficiado" type="number" value={formData.personalBeneficiado} onChange={handleChange} margin="normal" multiline rows={6} disabled={disabled} error={getError("personalBeneficiado")} helperText={`${formData.personalBeneficiado?.length || 0}/512`} inputProps={{ maxLength: 512 }} />

            {formData.responsables.map((resp, index) => (
              <Box key={index} display="flex" alignItems="center">
                <TextField fullWidth label={`Responsable ${index + 1}`} value={resp.nombre} onChange={(e) => handleDynamicChange("responsables", index, "nombre", e.target.value)} margin="normal" disabled={disabled} error={getError(`responsables.${index}.nombre`) }
                  helperText={`${resp.nombre?.length || 0}/255`} inputProps={{ maxLength: 255 }} />
                {!soloLectura && puedeEditar && (
                  <CustomButton
                    type="cancelar"
                    onClick={() => removeDynamicField("responsables", index)}
                  >
                    Eliminar
                  </CustomButton>)}
              </Box>
            ))}
            {!soloLectura && puedeEditar && (
              <CustomButton
                type="agregar"
                onClick={() => addDynamicField("responsables", { nombre: "" })}
              >
                Agregar Responsable
              </CustomButton>
            )}
            <Box>
              <Typography variant="caption" sx={{ display: "block", textAlign: "right", color: "text.secondary" }}>
                {formData.situacionActual.length}/{maxChars}
              </Typography>
              <TextField fullWidth label="Situación Actual" name="situacionActual" value={formData.situacionActual} onChange={handleChange} margin="normal" multiline rows={6} inputProps={{ maxLength: maxChars }} disabled={disabled} error={getError("situacionActual")} helperText={getHelper("situacionActual")} />
            </Box>
          </Box>
        );
      case 4:
        return (
          <Box>
            {formData.indicadoresExito.map((ind, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                gap={2}
                marginBottom={2}
                flexWrap="wrap"
              >
                <TextField
                  label={`Indicador ${index + 1}`}
                  value={ind.nombre}
                  onChange={(e) =>
                    handleDynamicChange("indicadoresExito", index, "nombre", e.target.value)
                  }
                  margin="normal"
                  fullWidth
                  sx={{ flex: 1 }}
                  disabled={disabled}
                  error={getError(`indicadoresExito.${index}.nombre`)}
                  helperText={`${ind.nombre?.length || 0}/255`}
                  inputProps={{ maxLength: 255 }}
                />
                <TextField
                  label="Meta"
                  type="number"
                  value={ind.meta || ""}
                  onChange={(e) =>
                    handleDynamicChange("indicadoresExito", index, "meta", e.target.value)
                  }
                  margin="normal"
                  fullWidth
                  sx={{ flex: 0.5 }}
                  disabled={disabled}
                  inputProps={{ min: 0 }}
                  error={getError(`indicadoresExito.${index}.meta`)}
                  helperText={getHelper(`indicadoresExito.${index}.meta`)}
                />
                {!soloLectura && puedeEditar && (
                  <CustomButton
                    type="cancelar"
                    onClick={() => removeDynamicField("indicadoresExito", index)}
                  >
                    Eliminar
                  </CustomButton>
                )}
              </Box>
            ))}
            {!soloLectura && puedeEditar && (
              <CustomButton
                type="agregar"
                onClick={() => addDynamicField("indicadoresExito", { nombre: "", meta: "" })}
              >
                Agregar Indicador
              </CustomButton>
            )}
          </Box>
        );
      case 5:
        return (
          <Box>
            {formData.recursos.map((rec, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                gap={2}
                marginBottom={2}
                flexWrap="wrap"
              >
                <TextField
                  fullWidth
                  label="Tiempo estimado de ejecución"
                  value={rec.tiempoEstimado}
                  onChange={(e) =>
                    handleDynamicChange("recursos", index, "tiempoEstimado", e.target.value)
                  }
                  margin="normal"
                  sx={{ flex: 1 }}
                  disabled={disabled}
                  error={getError(`recursos.${index}.tiempoEstimado`)}
                  helperText={`${rec.tiempoEstimado?.length || 0}/100`}
                  inputProps={{ maxLength: 100 }}
                />
                <TextField
                  fullWidth
                  label="Recursos materiales y humanos"
                  value={rec.recursosMatHum}
                  onChange={(e) =>
                    handleDynamicChange("recursos", index, "recursosMatHum", e.target.value)
                  }
                  margin="normal"
                  sx={{ flex: 1 }}
                  disabled={disabled}
                  error={getError(`recursos.${index}.recursosMatHum`)}
                  helperText={`${rec.recursosMatHum?.length || 0}/255`}
                  inputProps={{ maxLength: 255 }}
                />
              </Box>
            ))}
            <TextField
              fullWidth
              label="Costo Estimado del Proyecto"
              name="costoProyecto"
              type="number"
              value={formData.costoProyecto}
              onChange={handleChange}
              margin="normal"
              disabled={disabled}
              inputProps={{ min: 0 }}
              error={getError("costoProyecto")}
              helperText={getHelper("costoProyecto")}
            />
          </Box>
        );
      case 6:
        return (
          <Box>
            {formData.actividadesPM.map((act, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                gap={2}
                flexWrap="wrap"
                marginBottom={2}
              >
                <TextField
                  fullWidth
                  label="Etapa/Actividad"
                  value={act.actividad}
                  onChange={(e) =>
                    handleDynamicChange("actividadesPM", index, "actividad", e.target.value)
                  }
                  margin="normal"
                  sx={{ flex: 1 }}
                  disabled={disabled}
                  error={getError(`actividadesPM.${index}.actividad`)}
                  helperText={`${act.actividad?.length || 0}/255`}
                  inputProps={{ maxLength: 255 }}
                />
                <TextField
                  fullWidth
                  label="Responsable"
                  value={act.responsable}
                  onChange={(e) =>
                    handleDynamicChange("actividadesPM", index, "responsable", e.target.value)
                  }
                  margin="normal"
                  sx={{ flex: 1 }}
                  disabled={disabled}
                  error={getError(`actividadesPM.${index}.responsable`)}
                  helperText={`${act.responsable?.length || 0}/100`}
                  inputProps={{ maxLength: 100 }}
                />
                <TextField
                  fullWidth
                  label="Fecha"
                  type="date"
                  value={act.fecha}
                  onChange={(e) =>
                    handleDynamicChange("actividadesPM", index, "fecha", e.target.value)
                  }
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  sx={{ flex: 1 }}
                  disabled={disabled}
                  error={getError(`actividadesPM.${index}.fecha`)}
                  helperText={getHelper(`actividadesPM.${index}.fecha`)}
                />
                {/* Botón para eliminar actividad */}
                {!soloLectura && puedeEditar && (
                  <CustomButton
                    type="cancelar"
                    onClick={() => removeDynamicField("actividadesPM", index)}
                  >
                    Eliminar
                  </CustomButton>
                )}
              </Box>
            ))}
            {/* Botón para añadir más actividades - AQUÍ ESTÁ LO NUEVO */}
            {!soloLectura && puedeEditar && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <CustomButton
                  type="aceptar"
                  onClick={() => addDynamicField("actividadesPM", { actividad: "", responsable: "", fecha: "" })}
                >
                  Añadir Actividad
                </CustomButton>
              </Box>
            )}
          </Box>
        );
      case 7:
        return (
          <Box>
            <TextField
              fullWidth
              label="Nombre de Aprobación"
              name="aprobacionNombre"
              value={formData.aprobacionNombre}
              onChange={handleChange}
              margin="normal"
              disabled={disabled}
              error={getError("aprobacionNombre")}
              helperText={`${formData.aprobacionNombre?.length || 0}/255`}
              inputProps={{ maxLength: 255 }}
            />
            <TextField
              fullWidth
              label="Puesto de Aprobación"
              name="aprobacionPuesto"
              value={formData.aprobacionPuesto}
              onChange={handleChange}
              margin="normal"
              disabled={disabled}
              error={getError("aprobacionPuesto")}
              helperText={`${formData.aprobacionPuesto?.length || 0}/255`}
              inputProps={{ maxLength: 255 }}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 4, width: "800px", margin: "auto", minHeight: "600px", borderRadius: 2, border: "1px solid #ccc", boxShadow: 2, backgroundColor: "#fff" }}>
      <Title text="Formulario de Proyecto de Mejora" />
      <Stepper activeStep={activeStep} orientation="vertical" nonLinear>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton onClick={handleStep(index)}>{label}</StepButton>
            <StepContent>
              <Box sx={{ minHeight: "300px" }}>{renderStepContent(index)}</Box>
              <Box sx={{ mb: 2, display: "flex", justifyContent: "center", gap: 2 }}>
                {!soloLectura && puedeEditar && (
                  <CustomButton type="cancelar" onClick={handleBack}>
                    Anterior
                  </CustomButton>

                )}
                {activeStep > 0 && (
                  <CustomButton
                    type="guardar"
                    onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                  >
                    {activeStep === steps.length - 1 ? "Enviar" : "Siguiente"}
                  </CustomButton>
                )}
              </Box>


            </StepContent>
          </Step>
        ))}
      </Stepper>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ProyectoMejoraVertical;
