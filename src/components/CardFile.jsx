import React from "react";
import { Card, CardActionArea, CardContent, Typography, Grid } from "@mui/material";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderIcon from "@mui/icons-material/Folder";
import { useNavigate } from "react-router-dom";

function CardFile({ nombreCarpeta, ruta }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(ruta); // Navega a la ruta proporcionada
  };

  return (
    <Grid item>
      <Card
        sx={{
          width: 200,
          height: 200,
          textAlign: "center",
          alignContent: "center",
        }}
      >
        <CardActionArea onClick={handleClick}>
          <CardContent>
            <InsertDriveFileIcon sx={{ fontSize: 70, color: "#F9B800" }} />
          </CardContent>
          <Typography variant="body2">{nombreCarpeta}</Typography>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default CardFile;
