// src/components/Forms/DocumentFormDialog.jsx
import React from "react";
import {
    Dialog, DialogContent, DialogActions,
    TextField, MenuItem, Box, Typography,
    FormGroup, FormControlLabel, Checkbox
} from "@mui/material";
import CustomButton from "../Button";
import DialogTitleCustom from "../TitleDialog";

const USUARIOS_OPCIONES = [
    "ALUMNOS",
    "PERSONAL ADMINISTRATIVO",
    "FUNCIONARIADO",
    "FUNCIONARIOS",
    "COORDINADORES DE SERVICIO SOCIAL"
];

const CHAR_LIMITS = {
    nombreDocumento: 255,
    codigoDocumento: 50,
    responsable: 255,
    lugarAlmacenamiento: 100,
    disposicion: 255
};

const MEDIOS = [
    { value: "Físico", label: "Físico" },
    { value: "Digital", label: "Electrónico" },
    { value: "Ambos", label: "Físico y Electrónico" },
];


const DocumentFormDialog = ({
    open,
    onClose,
    modo = "crear",
    data,
    onChange,
    onSubmit,
    errors = {},
    submitting = false,
}) => {
    const esExterno = data.tipoDocumento === "externo";
    // Función para formatear valores para mostrar
    const formatValue = (value) => {
        if (value === null || value === undefined) return "";
        if (typeof value === "number" && value === 0) return "0";
        return value;
    };

    const RequiredLabel = ({ children }) => (
        <Box component="span">
            {children}
            <Box component="span" sx={{ color: 'error.main' }}>*</Box>
        </Box>
    );

    const renderHelper = (value, limit, error) => (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ color: error ? '#d32f2f' : 'inherit' }}>
                {error || ''}
            </span>
            <span style={{ color: (value?.length || 0) >= limit ? '#d32f2f' : 'inherit' }}>
                {(value?.length || 0)}/{limit}
            </span>
        </Box>
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitleCustom
                title={modo === "editar" ? "Editar Documento" : "Agregar Nuevo Documento"}
                subtitle="Completa los campos requeridos para el documento"
            />

            <DialogContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
                    {/* Campos principales con límites de caracteres */}
                    <TextField
                        label={<RequiredLabel>Nombre del Documento</RequiredLabel>}
                        fullWidth
                        variant="outlined"
                        value={data.nombreDocumento}
                        onChange={(e) => onChange("nombreDocumento", e.target.value)}
                        error={!!errors.nombreDocumento}
                        helperText={renderHelper(data.nombreDocumento, CHAR_LIMITS.nombreDocumento, errors.nombreDocumento)}
                        inputProps={{ maxLength: CHAR_LIMITS.nombreDocumento }}
                    />

                    <TextField
                        label={<RequiredLabel>Tipo de Documento</RequiredLabel>}
                        select
                        fullWidth
                        variant="outlined"
                        value={data.tipoDocumento}
                        onChange={(e) => {
                            const tipo = e.target.value;
                            onChange("tipoDocumento", tipo);
                            if (tipo !== "externo") {
                                onChange("fechaVersion", null);
                            }
                        }}
                        error={!!errors.tipoDocumento}
                        helperText={errors.tipoDocumento}
                    >
                        <MenuItem value="interno">INT</MenuItem>
                        <MenuItem value="externo">EXT</MenuItem>
                    </TextField>
                    {/* 1) Código: solo visible para tipo interno */}
                    {!esExterno && (
                        <TextField
                            label="Código del Documento"
                            fullWidth
                            variant="outlined"
                            value={data.codigoDocumento}
                            onChange={(e) => onChange("codigoDocumento", e.target.value)}
                            error={!!errors.codigoDocumento}
                            helperText={errors.codigoDocumento || `Máximo ${CHAR_LIMITS.codigoDocumento} caracteres`}
                            inputProps={{ maxLength: CHAR_LIMITS.codigoDocumento }}
                        />
                    )}

                    {/* Campos condicionales para externos */}
                    {esExterno && (
                        <>
                            <TextField
                                label="Fecha de Última Versión"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                variant="outlined"
                                value={data.fechaVersion || ""}
                                onChange={(e) => onChange("fechaVersion", e.target.value || null)}
                                error={!!errors.fechaVersion}
                                helperText={errors.fechaVersion}
                            />

                            <TextField
                                label="Número de Revisión"
                                fullWidth
                                type="number"
                                variant="outlined"
                                value={formatValue(data.noRevision)}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    onChange("noRevision", value === "" ? 0 : parseInt(value));
                                }}
                                inputProps={{ min: 0 }}
                                error={!!errors.noRevision}
                                helperText={errors.noRevision}
                            />
                        </>
                    )}

                    {/* Campos para internos */}
                    {!esExterno && (
                        <TextField
                            label="Fecha de Revisión"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            variant="outlined"
                            value={data.fechaRevision || ""}
                            onChange={(e) => onChange("fechaRevision", e.target.value || null)}
                            error={!!errors.fechaRevision}
                            helperText={errors.fechaRevision}
                        />
                    )}

                    <TextField
                        label={<RequiredLabel>Responsable</RequiredLabel>}
                        fullWidth
                        variant="outlined"
                        value={data.responsable}
                        onChange={(e) => onChange("responsable", e.target.value)}
                        error={!!errors.responsable}
                        helperText={renderHelper(data.responsable, CHAR_LIMITS.responsable, errors.responsable)}
                        inputProps={{ maxLength: CHAR_LIMITS.responsable }}
                    />

                    {/* Checkbox de usuarios */}
                    <Box>
                        <Typography sx={{ fontWeight: "bold", mb: 1 }}>Usuarios:</Typography>
                        <FormGroup row>
                            {USUARIOS_OPCIONES.map((usuario) => (
                                <FormControlLabel
                                    key={usuario}
                                    control={
                                        <Checkbox
                                            checked={(data.usuarios || []).includes(usuario)}
                                            onChange={(e) => {
                                                const nuevos = e.target.checked
                                                    ? [...(data.usuarios || []), usuario]
                                                    : (data.usuarios || []).filter((u) => u !== usuario);
                                                onChange("usuarios", nuevos);
                                            }}
                                        />
                                    }
                                    label={usuario}
                                />
                            ))}
                        </FormGroup>
                    </Box>

                    {/* Campos numéricos que pueden ser 0 */}
                    <TextField
                        label="No. Copias"
                        fullWidth
                        type="number"
                        variant="outlined"
                        value={formatValue(data.noCopias)}
                        onChange={(e) => {
                            const value = e.target.value;
                            onChange("noCopias", value === "" ? 0 : parseInt(value));
                        }}
                        inputProps={{ min: 0 }}
                    />

                    <TextField
                        label={<RequiredLabel>Medio de Almacenamiento</RequiredLabel>}
                        select
                        fullWidth
                        variant="outlined"
                        value={data.medioAlmacenamiento}
                        onChange={(e) => onChange("medioAlmacenamiento", e.target.value)}
                        error={!!errors.medioAlmacenamiento}
                        helperText={errors.medioAlmacenamiento}
                    >
                        {MEDIOS.map((m) => (
                            <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Tiempo de Retención"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={formatValue(data.tiempoRetencion)}
                        onChange={(e) => {
                            const value = e.target.value;
                            onChange("tiempoRetencion", value === "" ? 0 : parseInt(value));
                        }}
                        inputProps={{ min: 0 }}
                    />

                    <TextField
                        label={<RequiredLabel>Lugar de Almacenamiento</RequiredLabel>}
                        fullWidth
                        variant="outlined"
                        value={data.lugarAlmacenamiento}
                        onChange={(e) => onChange("lugarAlmacenamiento", e.target.value)}
                        error={!!errors.lugarAlmacenamiento}
                        helperText={renderHelper(data.lugarAlmacenamiento, CHAR_LIMITS.lugarAlmacenamiento, errors.lugarAlmacenamiento)}
                        inputProps={{ maxLength: CHAR_LIMITS.lugarAlmacenamiento }}
                    />

                    <TextField
                        label="Disposición después del Periodo de Retención"
                        fullWidth
                        variant="outlined"
                        value={data.disposicion || ""}
                        onChange={(e) => onChange("disposicion", e.target.value || null)}
                        error={!!errors.disposicion}
                        helperText={renderHelper(data.disposicion || "", CHAR_LIMITS.disposicion, errors.disposicion)} inputProps={{ maxLength: CHAR_LIMITS.disposicion }}
                    />

                    {/* Upload de archivo solo para internos */}
                    {!esExterno && (
                        <Box>
                            <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                                Subir Archivo
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <label htmlFor="archivo-upload">
                                    <input
                                        id="archivo-upload"
                                        type="file"
                                        hidden
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                                        onChange={(e) => onChange("archivo", e.target.files[0])}
                                    />
                                    <CustomButton component="span" type="descargar">
                                        Seleccionar archivo
                                    </CustomButton>
                                </label>
                                {data.archivo && (
                                    <Typography variant="body2">
                                        {data.archivo.name}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ justifyContent: "center", padding: 2 }}>
                <CustomButton type="cancelar" onClick={onClose} disable={submitting}>
                    Cancelar
                </CustomButton>
                <CustomButton type="guardar" onClick={onSubmit} loading={submitting} loadingLabel="Guardando...">
                    {modo === "editar" ? "Guardar Cambios" : "Guardar"}
                </CustomButton>
            </DialogActions>
        </Dialog>
    );
};



export default DocumentFormDialog;
