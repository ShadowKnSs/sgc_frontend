import React, { useState } from "react";
import { Card, CardActionArea, CardContent, Typography, Dialog, DialogTitle, Button } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

const CardAddArchivo = () => {
    const [open, setOpen] = useState(false);
  
    return (
      <>
        <Card 
          sx={{ 
            width: 200, 
            height: 200, 
            textAlign: "center", 
            border: "2px dashed #004A98", 
            alignContent: "center",
            cursor: "pointer"
          }}
          onClick={() => setOpen(true)}
        >
          <CardActionArea>
            <CardContent>
              <AddBoxIcon sx={{ fontSize: 50, color: "#004A98" }} />
              <Typography variant="body2">Nuevo Archivo</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
  
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ textAlign: "center" }}>Seleccionar Archivo</DialogTitle>
          <CardContent>
            <Typography variant="body2" sx={{ textAlign: "center", marginBottom: 2 }}>
              Aquí irá el contenido para seleccionar un archivo.
            </Typography>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="outlined" onClick={() => setOpen(false)} sx={{ borderColor: "#004A98", color: "#004A98" }}>
                Cancelar
              </Button>
              <Button variant="contained" sx={{ backgroundColor: "#F9B800", "&:hover": { backgroundColor: "#2dc1df" } }}>
                Subir
              </Button>
            </div>
          </CardContent>
        </Dialog>
      </>
    );
  };

  export default CardAddArchivo;