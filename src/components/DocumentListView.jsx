// src/components/DocumentListView.jsx
import React, { useState } from "react";
import { ToggleButton, ToggleButtonGroup, Box, Grid } from "@mui/material";
import DocumentCard from "./DocumentCard";
import DocumentTable from "./DocumentTable";

const DocumentListView = ({ documentos, onEdit, onDelete, soloLectura }) => {
    const [modo, setModo] = useState("card");

    return (
        <Box>
            <ToggleButtonGroup
                value={modo}
                exclusive
                onChange={(e, value) => value && setModo(value)}
                sx={{ mb: 2 }}
            >
                <ToggleButton value="card">Tarjetas</ToggleButton>
                <ToggleButton value="table">Tabla</ToggleButton>
            </ToggleButtonGroup>

            {modo === "card" ? (
                <Grid container spacing={2}>
                    {documentos.map((doc) => (
                        <Grid item key={doc.idDocumento}>
                            <DocumentCard
                                documento={doc}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                soloLectura={soloLectura}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <DocumentTable
                    documentos={documentos}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    soloLectura={soloLectura}
                />
            )}
        </Box>
    );
};

export default DocumentListView;
