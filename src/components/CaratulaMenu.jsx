import React from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import EditIcon from "@mui/icons-material/Edit";

const CaratulaMenu = ({ menuAnchor, handleCloseMenu }) => {
  return (
    <Menu
      anchorEl={menuAnchor}
      open={Boolean(menuAnchor)}
      onClose={handleCloseMenu}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{ width: "100%" }}
    >
      <MenuItem
        onClick={handleCloseMenu}
        sx={{ display: "flex", justifyContent: "space-between", width: "200px", "&:hover": { backgroundColor: "#00BCD4", color: "white" } }}
      >
        <ListItemText primary="Ver" />
        <ListItemIcon>
          <VisibilityIcon />
        </ListItemIcon>
      </MenuItem>
      <MenuItem
        onClick={handleCloseMenu}
        sx={{ display: "flex", justifyContent: "space-between", width: "200px", "&:hover": { backgroundColor: "#00B2E3", color: "white" } }}
      >
        <ListItemText primary="Crear" />
        <ListItemIcon>
          <NoteAddIcon />
        </ListItemIcon>
      </MenuItem>
      <MenuItem
        onClick={handleCloseMenu}
        sx={{ display: "flex", justifyContent: "space-between", width: "200px", "&:hover": { backgroundColor: "#00BCD4", color: "white" } }}
      >
        <ListItemText primary="Editar" />
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
      </MenuItem>
    </Menu>
  );
};

export default CaratulaMenu;
