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

const MEDIOS = ["Físico", "Digital", "Ambos"];

const DocumentFormDialog = ({
    open,
    onClose,
    modo = "crear",
    data,
    onChange,
    onSubmit,
    errors = {}
}) => {
    const esExterno = data.tipoDocumento === "externo";

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitleCustom
                title={modo === "editar" ? "Editar Documento" : "Agregar Nuevo Documento"}
                subtitle="Completa los campos requeridos para el documento"
            />

            <DialogContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
                    <TextField
                        label="Nombre del Documento"
                        fullWidth
                        variant="outlined"
                        value={data.nombreDocumento}
                        onChange={(e) => onChange("nombreDocumento", e.target.value)}
                        error={!!errors.nombreDocumento}
                        helperText={errors.nombreDocumento}
                    />

                    <TextField
                        label="Código del Documento"
                        fullWidth
                        variant="outlined"
                        value={data.codigoDocumento}
                        onChange={(e) => onChange("codigoDocumento", e.target.value)}
                    />

                    <TextField
                        label="Tipo de Documento"
                        select
                        fullWidth
                        variant="outlined"
                        value={data.tipoDocumento}
                        onChange={(e) => {
                            const tipo = e.target.value;
                            onChange("tipoDocumento", tipo);
                            if (tipo !== "externo") onChange("fechaVersion", null);
                        }}
                        error={!!errors.tipoDocumento}
                        helperText={errors.tipoDocumento}
                    >
                        <MenuItem value="interno">INT</MenuItem>
                        <MenuItem value="externo">EXT</MenuItem>
                    </TextField>

                    {esExterno && (
                        <TextField
                            label="Fecha de Última Versión"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            variant="outlined"
                            value={data.fechaVersion || ""}
                            onChange={(e) => onChange("fechaVersion", e.target.value)}
                            error={!!errors.fechaVersion}
                            helperText={errors.fechaVersion}
                        />
                    )}

                    {esExterno && (
                        <TextField
                            label="Número de Revisión"
                            fullWidth
                            type="number"
                            variant="outlined"
                            value={data.noRevision}
                            onChange={(e) => onChange("noRevision", parseInt(e.target.value) || 0)}
                            inputProps={{ min: 0 }}
                            error={!!errors.noRevision}
                            helperText={errors.noRevision}
                        />
                    )}


                    {data.tipoDocumento === "interno" && (
                        <TextField
                            label="Fecha de Revisión"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            variant="outlined"
                            value={data.fechaRevision}
                            onChange={(e) => onChange("fechaRevision", e.target.value)}
                            error={!!errors.fechaRevision}
                            helperText={errors.fechaRevision}
                        />
                    )}




                    <TextField
                        label="Responsable"
                        fullWidth
                        variant="outlined"
                        value={data.responsable}
                        onChange={(e) => onChange("responsable", e.target.value)}
                        error={!!errors.responsable}
                        helperText={errors.responsable}
                    />

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
                                                    ? [...data.usuarios, usuario]
                                                    : data.usuarios.filter((u) => u !== usuario);
                                                onChange("usuarios", nuevos);
                                            }}
                                        />
                                    }
                                    label={usuario}
                                />
                            ))}
                        </FormGroup>
                    </Box>

                    <TextField
                        label="No. Copias"
                        fullWidth
                        type="number"
                        variant="outlined"
                        value={data.noCopias}
                        onChange={(e) => onChange("noCopias", parseInt(e.target.value) || 0)}
                        inputProps={{ min: 0 }}
                    />

                    <TextField
                        label="Medio de Almacenamiento"
                        select
                        fullWidth
                        variant="outlined"
                        value={data.medioAlmacenamiento}
                        onChange={(e) => onChange("medioAlmacenamiento", e.target.value)}
                        error={!!errors.medioAlmacenamiento}
                        helperText={errors.medioAlmacenamiento}
                    >
                        {MEDIOS.map((m) => (
                            <MenuItem key={m} value={m}>{m}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Tiempo de Retención"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={data.tiempoRetencion}
                        onChange={(e) => onChange("tiempoRetencion", parseInt(e.target.value) || 0)}
                        inputProps={{ min: 0 }}
                    />

                    <TextField
                        label="Lugar de Almacenamiento"
                        fullWidth
                        variant="outlined"
                        value={data.lugarAlmacenamiento}
                        onChange={(e) => onChange("lugarAlmacenamiento", e.target.value)}
                        error={!!errors.lugarAlmacenamiento}
                        helperText={errors.lugarAlmacenamiento}
                    />

                    <TextField
                        label="Disposición después del Periodo de Retención"
                        fullWidth
                        variant="outlined"
                        value={data.disposicion}
                        onChange={(e) => onChange("disposicion", e.target.value)}
                        error={!!errors.disposicion}
                        helperText={errors.disposicion}
                    />

                    {data.tipoDocumento === "interno" && (
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
                <CustomButton type="cancelar" onClick={onClose}>
                    Cancelar
                </CustomButton>
                <CustomButton type="guardar" onClick={onSubmit}>
                    {modo === "editar" ? "Guardar Cambios" : "Guardar"}
                </CustomButton>
            </DialogActions>
        </Dialog>
    );
};

export default DocumentFormDialog;
