import React from 'react';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const NewIndicatorButton = ({ onClick }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
      <Fab 
        onClick={onClick} 
        sx={{
         
          backgroundColor: 'secondary.main', // color de acuerdo a tu paleta (ejemplo: púrpura)
          color: 'white',
          '&:hover': {
            backgroundColor: 'primary.main',
          },
          zIndex: 1100,
        }}
      >
        <AddIcon />
      </Fab>
      </div>
    );
  };
  
  export default NewIndicatorButton;
