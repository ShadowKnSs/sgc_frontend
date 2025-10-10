import React from "react";
import { 
    Box, TextField, Stepper, Step, StepButton, StepContent, 
    Typography, CircularProgress, Alert as MuiAlert 
} from "@mui/material";
import Title from "../Title";
import { useProyectoMejoraForm } from "../../hooks/useProyectoMejoraForm"
import CustomButton from "../../components/Button";

function ProyectoMejoraVertical({ soloLectura, puedeEditar, showSnackbar, onCancel, onSaved }) {
    const formContext = useProyectoMejoraForm(showSnackbar);

    if (!formContext) {
        return (
            <Box sx={{ p: 4, width: "800px", margin: "auto", minHeight: "600px", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <MuiAlert severity="error">
                    Error: No se pudo cargar el formulario.
                </MuiAlert>
            </Box>
        );
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
        erroresCampos,
        loading,
        error,
        saving
    } = formContext;

    // ✅ Función para manejar cancelación mejorada
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };

    // ✅ Función para manejar envío mejorado
    const handleSubmitImproved = async () => {
        await handleSubmit();
        if (onSaved) {
            onSaved();
        }
    };

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

    // ✅ Renderizado de estados
    if (loading) {
        return (
            <Box sx={{ p: 4, width: "800px", margin: "auto", minHeight: "600px", display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <CircularProgress size={60} thickness={4} />
                <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                    Cargando formulario...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4, width: "800px", margin: "auto", minHeight: "600px", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <MuiAlert 
                    severity="error" 
                    sx={{ 
                        '& .MuiAlert-message': { textAlign: 'left' }
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Error al cargar
                    </Typography>
                    <Typography variant="body2">
                        {error}
                    </Typography>
                </MuiAlert>
            </Box>
        );
    }

    const renderStepContent = (step) => {
        const disabled = soloLectura || saving;
        const getError = (name) => erroresCampos[name] || false;
        const getHelper = (name) => getError(name) ? "Este campo es obligatorio" : "";

        switch (step) {
            case 0:
                return (
                    <Box>
                        <TextField 
                            fullWidth 
                            label="División" 
                            name="division" 
                            value={formData.division} 
                            onChange={handleChange} 
                            margin="normal" 
                            inputProps={{ maxLength: 255 }} 
                            disabled={disabled} 
                            error={getError("division")} 
                            helperText={getError("division") ? "Este campo es obligatorio" : `${formData.division?.length || 0}/255`} 
                        />
                        <TextField 
                            fullWidth 
                            label="Departamento" 
                            name="departamento" 
                            value={formData.departamento} 
                            onChange={handleChange} 
                            margin="normal" 
                            inputProps={{ maxLength: 255 }} 
                            disabled={disabled} 
                            error={getError("departamento")} 
                            helperText={getError("departamento") ? "Este campo es obligatorio" : `${formData.departamento?.length || 0}/255`} 
                        />
                        <TextField 
                            fullWidth 
                            label="Fecha" 
                            name="fecha" 
                            type="date" 
                            value={formData.fecha} 
                            onChange={handleChange} 
                            margin="normal" 
                            disabled={disabled} 
                            error={getError("fecha")} 
                            helperText={getHelper("fecha")} 
                            InputLabelProps={{ shrink: true }}
                        />
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
                        <TextField 
                            fullWidth 
                            label="Responsable" 
                            name="responsable" 
                            value={formData.responsable} 
                            onChange={handleChange} 
                            margin="normal" 
                            inputProps={{ maxLength: 255 }} 
                            disabled={disabled} 
                            error={getError("responsable")} 
                            helperText={getError("responsable") ? "Este campo es obligatorio" : `${formData.responsable?.length || 0}/255`} 
                        />
                    </Box>
                );
            case 1:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography
                            variant="caption"
                            sx={{ display: "block", textAlign: "right", color: "text.secondary" }}
                        >
                            {formData.descripcionMejora?.length || 0}/{maxChars}
                        </Typography>
                        <TextField 
                            fullWidth 
                            label="Descripción de la Mejora" 
                            name="descripcionMejora" 
                            value={formData.descripcionMejora} 
                            onChange={handleChange} 
                            margin="normal" 
                            multiline 
                            minRows={2} 
                            maxRows={6}  
                            inputProps={{ maxLength: maxChars }} 
                            disabled={disabled} 
                            error={getError("descripcionMejora")} 
                            helperText={getHelper("descripcionMejora")} 
                        />
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ mt: 2 }}>
                        {formData.objetivos.map((obj, index) => (
                            <Box key={index} display="flex" alignItems="center" gap={1} mb={2}>
                                <TextField
                                    fullWidth
                                    label={`Objetivo ${index + 1}`}
                                    value={obj.descripcion}
                                    onChange={(e) => handleDynamicChange("objetivos", index, "descripcion", e.target.value)}
                                    margin="normal"
                                    disabled={disabled}
                                    error={getError(`objetivos.${index}.descripcion`)}
                                    helperText={getError(`objetivos.${index}.descripcion`) ? "Este campo es obligatorio" : `${obj.descripcion?.length || 0}/255`}
                                    inputProps={{ maxLength: 255 }}
                                />
                                {!soloLectura && puedeEditar && (
                                    <CustomButton
                                        type="cancelar"
                                        onClick={() => removeDynamicField("objetivos", index)}
                                        disabled={saving}
                                        sx={{ minWidth: '100px', mt: 1 }}
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
                                disabled={saving}
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
                                {formData.areaImpacto?.length || 0}/{maxChars}
                            </Typography>
                            <TextField 
                                fullWidth 
                                label="Área de Impacto" 
                                name="areaImpacto" 
                                value={formData.areaImpacto} 
                                onChange={handleChange} 
                                margin="normal" 
                                multiline 
                                rows={4} 
                                inputProps={{ maxLength: maxChars }} 
                                disabled={disabled} 
                                error={getError("areaImpacto")} 
                                helperText={getHelper("areaImpacto")} 
                            />
                        </Box>

                        <TextField 
                            fullWidth 
                            label="Personal Beneficiado" 
                            name="personalBeneficiado" 
                            type="number" 
                            value={formData.personalBeneficiado} 
                            onChange={handleChange} 
                            margin="normal" 
                            disabled={disabled} 
                            error={getError("personalBeneficiado")} 
                            helperText={getHelper("personalBeneficiado")}
                            inputProps={{ min: 0 }}
                        />

                        {formData.responsables.map((resp, index) => (
                            <Box key={index} display="flex" alignItems="center" gap={1} mb={2}>
                                <TextField 
                                    fullWidth 
                                    label={`Responsable ${index + 1}`} 
                                    value={resp.nombre} 
                                    onChange={(e) => handleDynamicChange("responsables", index, "nombre", e.target.value)} 
                                    margin="normal" 
                                    disabled={disabled} 
                                    error={getError(`responsables.${index}.nombre`)}
                                    helperText={getError(`responsables.${index}.nombre`) ? "Este campo es obligatorio" : `${resp.nombre?.length || 0}/255`} 
                                    inputProps={{ maxLength: 255 }} 
                                />
                                {!soloLectura && puedeEditar && (
                                    <CustomButton
                                        type="cancelar"
                                        onClick={() => removeDynamicField("responsables", index)}
                                        disabled={saving}
                                        sx={{ minWidth: '100px', mt: 1 }}
                                    >
                                        Eliminar
                                    </CustomButton>
                                )}
                            </Box>
                        ))}
                        {!soloLectura && puedeEditar && (
                            <CustomButton
                                type="agregar"
                                onClick={() => addDynamicField("responsables", { nombre: "" })}
                                disabled={saving}
                            >
                                Agregar Responsable
                            </CustomButton>
                        )}
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" sx={{ display: "block", textAlign: "right", color: "text.secondary" }}>
                                {formData.situacionActual?.length || 0}/{maxChars}
                            </Typography>
                            <TextField 
                                fullWidth 
                                label="Situación Actual" 
                                name="situacionActual" 
                                value={formData.situacionActual} 
                                onChange={handleChange} 
                                margin="normal" 
                                multiline 
                                rows={4} 
                                inputProps={{ maxLength: maxChars }} 
                                disabled={disabled} 
                                error={getError("situacionActual")} 
                                helperText={getHelper("situacionActual")} 
                            />
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
                                    helperText={getError(`indicadoresExito.${index}.nombre`) ? "Este campo es obligatorio" : `${ind.nombre?.length || 0}/255`}
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
                                        disabled={saving}
                                        sx={{ minWidth: '100px', mt: 1 }}
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
                                disabled={saving}
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
                                    helperText={getError(`recursos.${index}.tiempoEstimado`) ? "Este campo es obligatorio" : `${rec.tiempoEstimado?.length || 0}/100`}
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
                                    helperText={getError(`recursos.${index}.recursosMatHum`) ? "Este campo es obligatorio" : `${rec.recursosMatHum?.length || 0}/255`}
                                    inputProps={{ maxLength: 255 }}
                                />
                                {!soloLectura && puedeEditar && (
                                    <CustomButton
                                        type="cancelar"
                                        onClick={() => removeDynamicField("recursos", index)}
                                        disabled={saving}
                                        sx={{ minWidth: '100px', mt: 1 }}
                                    >
                                        Eliminar
                                    </CustomButton>
                                )}
                            </Box>
                        ))}
                        {!soloLectura && puedeEditar && (
                            <CustomButton
                                type="agregar"
                                onClick={() => addDynamicField("recursos", { tiempoEstimado: "", recursosMatHum: "" })}
                                disabled={saving}
                                sx={{ mb: 2 }}
                            >
                                Agregar Recurso
                            </CustomButton>
                        )}
                        <TextField
                            fullWidth
                            label="Costo Estimado del Proyecto"
                            name="costoProyecto"
                            type="number"
                            value={formData.costoProyecto}
                            onChange={handleChange}
                            margin="normal"
                            disabled={disabled}
                            inputProps={{ min: 0, step: "0.01" }}
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
                                    helperText={getError(`actividadesPM.${index}.actividad`) ? "Este campo es obligatorio" : `${act.actividad?.length || 0}/255`}
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
                                    helperText={getError(`actividadesPM.${index}.responsable`) ? "Este campo es obligatorio" : `${act.responsable?.length || 0}/100`}
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
                                {!soloLectura && puedeEditar && (
                                    <CustomButton
                                        type="cancelar"
                                        onClick={() => removeDynamicField("actividadesPM", index)}
                                        disabled={saving}
                                        sx={{ minWidth: '100px', mt: 1 }}
                                    >
                                        Eliminar
                                    </CustomButton>
                                )}
                            </Box>
                        ))}
                        {!soloLectura && puedeEditar && (
                            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                                <CustomButton
                                    type="aceptar"
                                    onClick={() => addDynamicField("actividadesPM", { actividad: "", responsable: "", fecha: "" })}
                                    disabled={saving}
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
                            helperText={getError("aprobacionNombre") ? "Este campo es obligatorio" : `${formData.aprobacionNombre?.length || 0}/255`}
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
                            helperText={getError("aprobacionPuesto") ? "Este campo es obligatorio" : `${formData.aprobacionPuesto?.length || 0}/255`}
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
            
            {/* ✅ Mostrar estado de guardado */}
            {saving && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 1, backgroundColor: 'info.light', borderRadius: 1 }}>
                    <CircularProgress size={20} sx={{ mr: 2 }} />
                    <Typography variant="body2">Guardando proyecto...</Typography>
                </Box>
            )}

            <Stepper activeStep={activeStep} orientation="vertical" nonLinear>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepButton 
                            onClick={handleStep(index)} 
                            disabled={saving}
                        >
                            {label}
                        </StepButton>
                        <StepContent>
                            <Box sx={{ minHeight: "300px" }}>{renderStepContent(index)}</Box>
                            <Box sx={{ mb: 2, display: "flex", justifyContent: "center", gap: 2 }}>
                                <CustomButton 
                                    type="cancelar" 
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    Cancelar
                                </CustomButton>
                                
                                {activeStep > 0 && (
                                    <CustomButton 
                                        type="cancelar" 
                                        onClick={handleBack}
                                        disabled={saving}
                                    >
                                        Anterior
                                    </CustomButton>
                                )}

                                <CustomButton
                                    type="guardar"
                                    onClick={activeStep === steps.length - 1 ? handleSubmitImproved : handleNext}
                                    disabled={saving}
                                    loading={saving && activeStep === steps.length - 1}
                                >
                                    {activeStep === steps.length - 1 
                                        ? (saving ? "Guardando..." : "Guardar Proyecto") 
                                        : "Siguiente"
                                    }
                                </CustomButton>
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}

export default ProyectoMejoraVertical;