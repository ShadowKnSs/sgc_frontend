import React from "react";
import { Box, Typography, Card, CardContent, Alert } from "@mui/material";

const DiagramaFlujo = ({ imageUrl }) => {
  return (
    <Box
      sx={{
        mb: 4,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#fff",
        margin: 4,
      }}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}
      >
        Diagrama de Flujo
      </Typography>

      {imageUrl ? (
        <Card sx={{ maxWidth: "100%", textAlign: "center" }}>
          <CardContent>
            <img
              src={imageUrl}
              alt="Diagrama de Flujo"
              style={{
                maxWidth: "100%",
                maxHeight: "600px",
                borderRadius: "10px",
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <Alert severity="error">
          No se ha registrado un Diagrama de Flujo para este proceso.
        </Alert>
      )}
    </Box>
  );
};

export default DiagramaFlujo;
