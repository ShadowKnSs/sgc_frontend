import { useState } from "react";
import { Grid, Card, CardActionArea, CardContent, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";

function CardArchivos({ nombreCarpeta, ruta, onEditClick }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  // Maneja la navegación a la vista siguiente solo cuando no se hace clic en los tres puntos
  const handleCardClick = () => {
    if (!anchorEl) {
      navigate(ruta); // Navega a la ruta proporcionada solo si no está abierto el menú
    }
  };

  const handleMenuOpen = (event) => {
    event.stopPropagation(); // Detener la propagación para evitar que el clic también navegue
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEditClick(nombreCarpeta); // Llamamos la función de edición
  };

  return (
    <Grid item>
      <Card
        sx={{
          width: 200,
          height: 200,
          textAlign: "center",
          alignContent: "center",
          position: "relative", // Para posicionar el botón de opciones
        }}
      >
        {/* Menú desplegable */}
        <IconButton
          sx={{ position: "absolute", top: 5, right: 5 }}
          onClick={handleMenuOpen} // Solo abre el menú sin navegar
        >
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleEdit}>Editar</MenuItem>
        </Menu>

        {/* Área de la tarjeta donde se debe realizar la navegación */}
        <CardActionArea onClick={handleCardClick}>
          <CardContent>
            <FolderIcon sx={{ fontSize: 70, color: "#F9B800" }} />
          </CardContent>
          <Typography variant="body2">{nombreCarpeta}</Typography>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default CardArchivos;
