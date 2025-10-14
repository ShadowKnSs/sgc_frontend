import React from "react";
import { Fab, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const FabCustom = ({ onClick, title = "Acción", icon = <AddIcon />, sx = {} }) => (
  <Tooltip title={title} arrow placement="left">
    <Fab
      color="primary"
      onClick={onClick}
      sx={{
        transition: "all 0.3s ease",
        "&:hover": { backgroundColor: "secondary.main", transform: "scale(1.1)" },
        ...sx,
      }}

    >
      {icon}
    </Fab>
  </Tooltip>
);

export default FabCustom;