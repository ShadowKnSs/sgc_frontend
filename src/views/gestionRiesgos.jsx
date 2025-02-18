import React from "react";
import { Box, Grid, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import AddBoxIcon from "@mui/icons-material/AddBox";

function GestionRiesgos() {
  return (
    <Box sx={{ p: 4 }}>
      <h1
        style={{
          textAlign: "center",
          marginBottom: "32px",
          fontFamily: "'Roboto', sans-serif",
          color: "#004A98",
        }}
      >
        Gestión de Riesgos
      </h1>

      <Grid container spacing={3} justifyContent="left">
        {/* Carpeta 2024 */}
        <Grid item>
          <Card sx={{ width: 200,height:200, textAlign: "center", alignContent:'center'}}>
            <CardActionArea>
              <CardContent>
                <FolderIcon sx={{ fontSize: 70, color: "#F9B800" }} />
              </CardContent>
              <Typography variant="body2">2024</Typography>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Carpeta 2023 */}
        <Grid item>
          <Card sx={{ width: 200,height:200, textAlign: "center", alignContent:'center'}}>
            <CardActionArea>
              <CardContent>
                <FolderIcon sx={{ fontSize: 70, color: "#F9B800" }} />
              </CardContent>
              <Typography variant="body2" >2023</Typography>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Botón para agregar nueva carpeta */}
        <Grid item>
          <Card sx={{ width: 200,height:200, textAlign: "center", border: "2px dashed #004A98" ,alignContent:'center'}}>
            <CardActionArea>
              <CardContent>
                <AddBoxIcon sx={{ fontSize: 50, color: "#004A98" }} />
                <Typography variant="body2"></Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default GestionRiesgos;
