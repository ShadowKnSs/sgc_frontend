import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';


const FabSubirFormato = ({ onClick }) => (
  <Tooltip title="Subir Formato" placement="left">
      <Fab
        color="primary"
        onClick={onClick}
        sx={{
          transition: 'all 0.3s ease',
          '&:hover': { backgroundColor: 'secondary.main' }
        }}
      >
        <AddIcon />
      </Fab>
    </Tooltip>
);

export default FabSubirFormato;
