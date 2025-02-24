import React, { useState } from "react";
import { Box, Container, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import PageButton from "../components/PageButton";
import UASLPLogo from "../assests/UASLP_SICAL_Logo.png";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import EditIcon from "@mui/icons-material/Edit";
import { Typography, TextField } from "@mui/material";

const ProcessView = () => {
  const [activeButton, setActiveButton] = useState("Caratula");
  const [menuAnchor, setMenuAnchor] = useState(null);

  const buttons = [
    "Caratula",
    "Control de Cambios",
    "Mapa de Proceso",
    "Diagrama de Flujo",
    "Plan de Control",
  ];

  const handleButtonClick = (event, label) => {
    if (activeButton === "Caratula" && label === "Caratula") {
      setMenuAnchor(event.currentTarget);
    }
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const renderContent = () => {
    switch (activeButton) {
      case "Caratula":
        return (
          <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Box sx={{ position: "relative", height: "320px", width: "250px", marginBottom: "30px", left: "-15px", display: "flex", justifyContent: "center" }}>
              <img src={UASLPLogo} alt="UASLP Logo" style={{ width: "100%" }} />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-around", width: "100%" }}>
              <Box>
                <p>Dr. Juanito Perez</p>
                <p>Secretario General</p>
                <p>Responsable</p>
              </Box>
              <Box>
                <p>Dr. Pedro Sanchez</p>
                <p>Secretario Escolar</p>
                <p>Revisó</p>
              </Box>
              <Box>
                <p>Dra. Paola Rivera</p>
                <p>Directora de Facultad</p>
                <p>Aprobó</p>
              </Box>
            </Box>
          </Box>
        );
      case "Control de Cambios":
        return <h2>Contenido de Control de Cambios</h2>;
      case "Mapa de Proceso":
        return (
          <Container maxWidth="xl">
            <Box sx={{ marginTop: "10px" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Documentos Relacionados:
              </Typography>
              <TextField
                fullWidth
                variant="filled"
                sx={{
                  backgroundColor: "#E0E0E0",
                  borderRadius: "10px",
                  "& .MuiFilledInput-root": {
                    borderRadius: "10px",
                  },
                }}
              />
            </Box>
            <Box sx={{ marginTop: "30px" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Fuentes de Entrada:
              </Typography>
              <TextField
                fullWidth
                variant="filled"
                sx={{
                  backgroundColor: "#E0E0E0",
                  borderRadius: "10px",
                  "& .MuiFilledInput-root": {
                    borderRadius: "10px",
                  },
                }}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
              <Box sx={{ width: "48%" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Material de Entrada:
                </Typography>
                <TextField
                  fullWidth
                  variant="filled"
                  sx={{
                    backgroundColor: "#E0E0E0",
                    borderRadius: "10px",
                    "& .MuiFilledInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                />
              </Box>
              <Box sx={{ width: "48%" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Requisito de Entrada:
                </Typography>
                <TextField
                  fullWidth
                  variant="filled"
                  sx={{
                    backgroundColor: "#E0E0E0",
                    borderRadius: "10px",
                    "& .MuiFilledInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
              <Box sx={{ width: "48%" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Salidas:
                </Typography>
                <TextField
                  fullWidth
                  variant="filled"
                  sx={{
                    backgroundColor: "#E0E0E0",
                    borderRadius: "10px",
                    "& .MuiFilledInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                />
              </Box>
              <Box sx={{ width: "48%" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Receptores:
                </Typography>
                <TextField
                  fullWidth
                  variant="filled"
                  sx={{
                    backgroundColor: "#E0E0E0",
                    borderRadius: "10px",
                    "& .MuiFilledInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                />
              </Box>
            </Box>
          </Container>
        );
        
      case "Diagrama de Flujo":
        return <h2>Contenido de Diagrama de Flujo</h2>;
      case "Plan de Control":
        return <h2>Contenido de Plan de Control</h2>;
      default:
        return <h2>Seleccione una opción</h2>;
    }
  };

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "20px",
          marginTop: "40px",
          flexWrap: "nowrap",
          width: "100%",
          gap: "30px",
        }}
      >
        {buttons.map((label) => (
          <Box
            key={label}
            onClick={(event) => handleButtonClick(event, label)}
          >
            <PageButton
              label={label}
              active={activeButton === label}
              onClick={() => setActiveButton(label)}
            />
          </Box>
        ))}
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ width: "100%" }}
      >
        <MenuItem onClick={handleCloseMenu} sx={{ display: "flex", justifyContent: "space-between", width: "200px", '&:hover': { backgroundColor: "#00BCD4", color: "white" } }}>
          <ListItemText primary="Ver" />
          <ListItemIcon>
            <VisibilityIcon />
          </ListItemIcon>
        </MenuItem>
        <MenuItem onClick={handleCloseMenu} sx={{ display: "flex", justifyContent: "space-between", width: "200px", '&:hover': { backgroundColor: "#00B2E3", color: "white" } }}>
          <ListItemText primary="Crear" />
          <ListItemIcon>
            <NoteAddIcon />
          </ListItemIcon>
        </MenuItem>
        <MenuItem onClick={handleCloseMenu} sx={{ display: "flex", justifyContent: "space-between", width: "200px", '&:hover': { backgroundColor: "#00BCD4", color: "white" } }}>
          <ListItemText primary="Editar" />
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
        </MenuItem>
      </Menu>

      <Box
        sx={{
          border: "2px solid black",
          padding: "10px",
          minHeight: "500px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: "auto",
          backgroundColor: "white",
          textAlign: "center",
        }}
      >
        {renderContent()}
      </Box>
    </Container>
  );
};

export default ProcessView;
