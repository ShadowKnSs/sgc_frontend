import React, { useState, useCallback } from "react";
import { 
  Card, CardActionArea, CardContent, Typography, Grid, Dialog, 
  DialogTitle, TextField, Button 
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

const CardAddFolder = () => {
  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const handleOpen = useCallback(() => setOpen(true), []);
  
  const handleClose = useCallback(() => {
    setOpen(false);
    setFolderName("");
  }, []);

  const handleSave = useCallback(() => {
    if (folderName.trim()) {
      console.log("Nueva carpeta:", folderName.trim());
      handleClose();
    }
  }, [folderName, handleClose]);

  const handleChange = useCallback((e) => setFolderName(e.target.value), []);

  return (
    <>
      <Grid item>
        <Card 
          sx={{ 
            width: 200, 
            height: 200, 
            textAlign: "center", 
            border: "2px dashed #004A98", 
            alignContent: "center" 
          }}
        >
          <CardActionArea onClick={handleOpen}>
            <CardContent>
              <AddBoxIcon sx={{ fontSize: 50, color: "#004A98" }} />
              <Typography variant="body2">Nueva Carpeta</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: "center" }}>Nueva Carpeta</DialogTitle>
        <CardContent>
          <TextField
            fullWidth
            variant="outlined"
            label="Nombre"
            value={folderName}
            onChange={handleChange}
            autoFocus
          />
          <Grid container justifyContent="space-between" sx={{ marginTop: 2 }}>
            <Button 
              variant="outlined"
              onClick={handleClose} // Se agregó el evento onClick
              sx={{ 
                borderRadius: 2,
                transition: 'all 0.3s ease',
                backgroundColor: 'transparent',
                color: 'inherit', 
                borderColor:'#004A98',
                '&:hover': {
                  borderWidth: '2px',
                  transform: 'scale(1.05)',
                  boxShadow: '0px 0px 8px rgba(0,0,0,0.2)',
                }
              }}
            >
              Cancelar
            </Button>
            <Button 
              variant="contained"
              onClick={handleSave} // Se agregó el evento onClick
              sx={{ 
                borderRadius: 2,
                transition: 'all 0.3s ease',
                backgroundColor: '#F9B800',
                '&:hover': {
                  backgroundColor:  '#2dc1df',
                  transform: 'scale(1.05)',
                }
              }}
            >
              Guardar
            </Button>
          </Grid>
        </CardContent>
      </Dialog>
    </>
  );
};

export default CardAddFolder;
