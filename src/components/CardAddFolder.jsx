import React, { useState } from "react";
import { Card, CardActionArea, CardContent, Typography, Grid, Dialog, DialogTitle, TextField, Button } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

function CardAddFolder() {
  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = () => {
    console.log("Nueva carpeta:", folderName);
    handleClose();
  };

  return (
    <>
      {/* Botón para agregar nueva carpeta */}
      <Grid item>
        <Card sx={{ width: 200, height: 200, textAlign: "center", border: "2px dashed #004A98", alignContent: "center" }}>
          <CardActionArea onClick={handleOpen}>
            <CardContent>
              <AddBoxIcon sx={{ fontSize: 50, color: "#004A98" }} />
              <Typography variant="body2">Nueva Carpeta</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>

      {/* Modal para ingresar el nombre de la nueva carpeta */}
      <Dialog open={open} onClose={handleClose} width={50} >
        <DialogTitle sx={{ textAlign: "center" }}>Nueva Carpeta</DialogTitle>
        <CardContent>
          <TextField
            fullWidth
            variant="outlined"
            label="Nombre"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
          <Grid container justifyContent="space-between" sx={{ marginTop: 2 }}>
            <Button variant="contained" sx={{ backgroundColor: "#F9B800" }} onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="contained" sx={{ backgroundColor: "#004A98", color: "white" }} onClick={handleSave}>
              Guardar
            </Button>
          </Grid>
        </CardContent>
      </Dialog>
    </>
  );
}

export default CardAddFolder;
