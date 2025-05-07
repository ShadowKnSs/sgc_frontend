import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TitleDialog from '../TitleDialog';


const NewsModal = ({ open, newsItem, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
      <TitleDialog title={newsItem?.title} />
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ textAlign: 'center' }}>
        {newsItem?.image && (
          <img
            src={newsItem.image}
            alt={newsItem.title}
            style={{ width: '70%', marginBottom: '1em', borderRadius: '5px' }}
          />
        )}
        <Typography variant="body1" sx={{ textAlign: 'justify', whiteSpace: "pre-line"}}>
          {newsItem?.description}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewsModal;
