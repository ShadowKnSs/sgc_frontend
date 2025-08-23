import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const EmptyState = ({ 
  title, 
  description, 
  buttonText, 
  onButtonClick, 
  icon: Icon = null 
}) => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
        px: 2,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        border: '1px dashed',
        borderColor: 'divider'
      }}
    >
      {Icon && (
        <Icon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
      )}
      
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
        {description}
      </Typography>
      
      {buttonText && onButtonClick && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onButtonClick}
          sx={{ borderRadius: 2 }}
        >
          {buttonText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;