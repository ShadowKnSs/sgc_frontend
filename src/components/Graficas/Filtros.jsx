import React from 'react';
import { Box, TextField, Button } from '@mui/material';

const Filtros = ({ startDate, endDate,  onStartDateChange, onEndDateChange, onUpdate }) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            <TextField
                label="Fecha de inicio"
                type="date"
                value={startDate}
                onChange={onStartDateChange}
                InputLabelProps={{ shrink: true }}
            />
            <TextField
                label="Fecha de fin"
                type="date"
                value={endDate}
                onChange={onEndDateChange}
                InputLabelProps={{ shrink: true }}
            />
            <Button variant="contained" onClick={onUpdate} sx={{ height: '56px' }}>
                Actualizar
            </Button>
        </Box>
    );
};

export default Filtros;
