import React from "react";
import {
  Dialog, AppBar, Toolbar, IconButton, Typography, Box, useTheme, useMediaQuery
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ImagenModalNot({ open, src, alt = "", title = "Vista ampliada", onClose }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { bgcolor: "#111" } }}
    >
      <AppBar color="default" sx={{ position: "relative", bgcolor: "#111", color: "#fff" }} elevation={1}>
        <Toolbar>
          <Typography
            variant="subtitle1"
            sx={{ flex: 1, mr: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            title={title}
          >
            {title}
          </Typography>
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="cerrar">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          height: fullScreen ? "calc(100vh - 64px)" : "80vh",
          overflow: "auto",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          p: { xs: 1.5, sm: 2, md: 3 },
          bgcolor: "#111",
        }}
      >
        {src && (
          <Box
            component="img"
            src={src}
            alt={alt}
            draggable={false}
            sx={{
              width: "100%",
              height: "auto",
              maxWidth: 1600,       // límite razonable de ancho
              borderRadius: 1,
              boxShadow: "0 0 0 1px rgba(255,255,255,0.06)",
              objectFit: "contain",
            }}
          />
        )}
      </Box>
    </Dialog>
  );
}
