import React, { useState } from "react";
import { Box, Button, TextField, Checkbox, FormControlLabel } from "@mui/material";

function ProyectoMejora() {
    const [formData, setFormData] = useState({
        noMejora: "",
        descripcionMejora: "",
        objetivo: "",
        areaImpacto: "",
        personalBeneficiado: "",
        situacionActual: "",
        indicadorExito: "",
        aprobacion: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = () => {
        console.log("Datos del Proyecto de Mejora:", formData);
    };

    return (
        <Box sx={{ p: 4, maxWidth: '100%', width: '800px', margin: "auto", display: "flex", flexDirection: "column", gap: 2, marginTop: -6}}>
            <h2>Formulario de Proyecto de Mejora</h2>
            
            <TextField fullWidth label="Número de Mejora" name="noMejora" type="number" value={formData.noMejora} onChange={handleChange} />
            <TextField fullWidth label="Descripción" name="descripcionMejora" value={formData.descripcionMejora} onChange={handleChange} />
            <TextField fullWidth label="Objetivo" name="objetivo" value={formData.objetivo} onChange={handleChange} />
            <TextField fullWidth label="Área de Impacto" name="areaImpacto" value={formData.areaImpacto} onChange={handleChange} />
            <TextField fullWidth label="Personal Beneficiado" name="personalBeneficiado" type="number" value={formData.personalBeneficiado} onChange={handleChange} />
            <TextField fullWidth label="Situación Actual" name="situacionActual" value={formData.situacionActual} onChange={handleChange} />
            <TextField fullWidth label="Indicador de Éxito" name="indicadorExito" type="number" step="0.01" value={formData.indicadorExito} onChange={handleChange} />
            
            <FormControlLabel
                control={<Checkbox name="aprobacion" checked={formData.aprobacion} onChange={handleChange} />}
                label="Aprobado"
            />

            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Guardar Proyecto
            </Button>
        </Box>
    );
}

export default ProyectoMejora;
