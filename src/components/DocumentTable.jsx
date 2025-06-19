// src/components/DocumentTable.jsx
import React from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, IconButton, Tooltip
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const campos = [
    { label: "Nombre", key: "nombreDocumento" },
    { label: "Código", key: "codigoDocumento" },
    { label: "Tipo", key: "tipoDocumento" },
    { label: "Revisión", key: "fechaRevision" },
    { label: "Versión", key: "fechaVersion" },
    { label: "No. Revisiones", key: "noRevision" },
    { label: "No. Copias", key: "noCopias" },
    { label: "Retención", key: "tiempoRetencion" },
    { label: "Lugar", key: "lugarAlmacenamiento" },
    { label: "Medio", key: "medioAlmacenamiento" },
    { label: "Disposición", key: "disposicion" },
    { label: "Responsable", key: "responsable" },
];

const DocumentTable = ({ documentos, onEdit, onDelete, soloLectura }) => (
    <TableContainer component={Paper} sx={{ mt: 1, borderRadius: 2, boxShadow: 3, overflowX: "auto" }}>
        <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
            <TableHead>
                <TableRow sx={{ backgroundColor: "#E3F2FD" }}>
                    {campos.map((campo) => (
                        <TableCell
                            key={campo.key}
                            sx={{

                                fontWeight: "bold",
                                textTransform: "uppercase",
                                wordWrap: "break-word"
                            }}
                        >
                            {campo.label}
                        </TableCell>
                    ))}
                    <TableCell sx={{ fontWeight: "bold" }}>ACCIONES</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {documentos.map((doc, index) => (
                    <TableRow
                        key={doc.idDocumento}
                        sx={{
                            backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                            "&:hover": { backgroundColor: "#EEF4FF" }
                        }}
                    >
                        {campos.map((campo) => (
                            <TableCell
                                key={campo.key}
                                sx={{
                                    maxWidth: 180,
                                    whiteSpace: "normal",
                                    wordBreak: "break-word"
                                }}
                            >
                                {doc[campo.key] || "—"}
                            </TableCell>
                        ))}

                        <TableCell>
                            <Tooltip title="Descargar">
                                <span>
                                    <IconButton
                                        size="small"
                                        component="a"
                                        href={doc.tipoDocumento === "interno" && doc.urlArchivo ? doc.urlArchivo : undefined}
                                        download
                                        disabled={doc.tipoDocumento !== "interno" || !doc.urlArchivo}
                                    >
                                        <DownloadIcon fontSize="small" sx={{ color: "#185FA4" }} />
                                    </IconButton>
                                </span>
                            </Tooltip>


                            {!soloLectura && (
                                <>
                                    <Tooltip title="Editar">
                                        <IconButton size="small" onClick={() => onEdit?.(doc)}>
                                            <EditIcon fontSize="small" sx={{ color: "#1976d2" }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                                        <IconButton size="small" onClick={() => onDelete?.(doc)}>
                                            <DeleteIcon fontSize="small" sx={{ color: "#d32f2f" }} />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

export default DocumentTable;
