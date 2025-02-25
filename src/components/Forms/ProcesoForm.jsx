import React, { useState, useEffect } from "react";
import { Box, TextField, MenuItem, Card, CardContent, Typography } from "@mui/material";
import DialogActionButtons from "../DialogActionButtons"; // o el componente que uses para los botones

const ProcessForm = ({
    initialValues = {
        nombreProceso: "",
        idUsuario: "",
        objetivo: "",
        alcance: "",
        norma: "",
        idMacroproceso: "",
        estado: "",
        idEntidad: "",
        anioCertificado: "",
    },
    leaders = [],
    macroprocesos = [],
    entidades = [],
    years = [],
    onSubmit,
    onCancel,
    title = "Nuevo Proceso",
}) => {
    const [formData, setFormData] = useState(initialValues);

    useEffect(() => {
        setFormData(initialValues);
        console.log("Form data precargado:", initialValues);
    }, [initialValues]);

    const handleChange = (field) => (e) => {
        setFormData({
            ...formData,
            [field]: e.target.value,
        });
    };

    const handleSubmit = () => {
        onSubmit(formData);
    };

    const commonStyles = {
        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
        "& .MuiInputBase-root": { boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
        "& .Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1976d2" },
    };

    return (
        <Card sx={{ width: "100%", maxWidth: 800, p: 3, boxShadow: 3, borderRadius: "12px", margin: "0 auto" }}>
            <CardContent>
                <Typography variant="h1" sx={{ textAlign: "center", mb: 3, color: "primary.main", fontSize: "2.5rem" }}>
                    {title}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
                    <TextField
                        fullWidth
                        label="Nombre del Proceso"
                        variant="outlined"
                        value={formData.nombreProceso}
                        onChange={handleChange("nombreProceso")}
                        sx={commonStyles}
                    />
                    <TextField
                        select
                        fullWidth
                        label="Líder del Proceso"
                        value={formData.idUsuario}
                        onChange={handleChange("idUsuario")}
                        sx={commonStyles}
                    >
                        <MenuItem value=""></MenuItem>
                        {leaders.map((l) => (
                            <MenuItem key={l.idUsuario} value={l.idUsuario}>
                                {l.nombre} {l.apellidoPat} {l.apellidoMat}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        label="Objetivo del Proceso"
                        multiline
                        rows={3}
                        variant="outlined"
                        value={formData.objetivo}
                        onChange={handleChange("objetivo")}
                        sx={commonStyles}
                    />
                    <TextField
                        fullWidth
                        label="Alcance del Proceso"
                        multiline
                        rows={3}
                        variant="outlined"
                        value={formData.alcance}
                        onChange={handleChange("alcance")}
                        sx={commonStyles}
                    />
                    <TextField
                        select
                        fullWidth
                        label="Norma"
                        value={formData.norma}
                        onChange={handleChange("norma")}
                        sx={commonStyles}
                    >
                        <MenuItem value="ISO 9001">ISO 9001</MenuItem>
                        <MenuItem value="ISO 14001">ISO 14001</MenuItem>
                        <MenuItem value="ISO 45001">ISO 45001</MenuItem>
                    </TextField>
                    <TextField
                        select
                        fullWidth
                        label="Macroproceso"
                        value={formData.idMacroproceso}
                        onChange={handleChange("idMacroproceso")}
                        sx={commonStyles}
                    >
                        {macroprocesos.map((mp) => (
                            <MenuItem key={mp.idMacroproceso} value={mp.idMacroproceso}>
                                {mp.tipoMacroproceso}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        fullWidth
                        label="Estado"
                        value={formData.estado}
                        onChange={handleChange("estado")}
                        sx={commonStyles}
                    >
                        <MenuItem value="Activo">Activo</MenuItem>
                        <MenuItem value="Inactivo">Inactivo</MenuItem>
                    </TextField>
                    <TextField
                        select
                        fullWidth
                        label="Entidad/Dependencia"
                        value={formData.idEntidad}
                        onChange={handleChange("idEntidad")}
                        sx={commonStyles}
                    >
                        {entidades.map((ent) => (
                            <MenuItem key={ent.idEntidadDependecia} value={ent.idEntidadDependecia}>
                                {ent.nombreEntidad}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        fullWidth
                        label="Año de Certificación"
                        value={formData.anioCertificado}
                        onChange={handleChange("anioCertificado")}
                        sx={commonStyles}
                    >
                        {years.map((year) => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <DialogActionButtons
                        onCancel={onCancel}
                        onSave={handleSubmit}
                        saveText={title.includes("Editar") ? "Actualizar" : "Guardar"}
                        cancelText="Cancelar"
                        saveColor="#F9B800"
                        cancelColor="#0056b3"
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProcessForm;
