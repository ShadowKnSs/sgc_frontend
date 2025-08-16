// components/FabCustom.jsx
import React from "react";
import { Fab, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const FabCustom = ({ onClick, title = "Acción", icon = <AddIcon /> }) => (
  <Tooltip title={title} placement="left">
    <Fab
      color="primary"
      onClick={onClick}
      sx={{
        transition: "all 0.3s ease",
        "&:hover": { backgroundColor: "secondary.main" },
      }}
    >
      {icon}
    </Fab>
  </Tooltip>
);

export default FabCustom;
