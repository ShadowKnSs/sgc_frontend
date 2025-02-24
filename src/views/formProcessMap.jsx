import React from "react";
import { Box, Container, Typography, TextField } from "@mui/material";

const MapaProceso = () => {
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
};

export default MapaProceso;
