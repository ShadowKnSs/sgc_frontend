// components/BreadcrumbNav.jsx
import React from "react";
import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Home as HomeIcon, NavigateNext as NavigateNextIcon } from "@mui/icons-material";

const BreadcrumbNav = ({ items }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        {/* Home siempre con RouterLink */}
        <Link
          component={RouterLink}
          to="/"
          color="inherit"
          underline="hover"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Inicio
        </Link>

        {items.map((item, i) =>
          i === items.length - 1 ? (
            // Último: solo texto y aria-current
            <Typography
              key={i}
              color="text.primary"
              aria-current="page"
              sx={{ display: "flex", alignItems: "center" }}
            >
              {item.icon && <item.icon sx={{ mr: 0.5 }} fontSize="inherit" />}
              {item.label}
            </Typography>
          ) : (
            <Link
              key={i}
              component={RouterLink}
              to={item.to}                 // ← usa 'to' en vez de 'href'
              color="inherit"
              underline="hover"
              sx={{ display: "flex", alignItems: "center" }}
            >
              {item.icon && <item.icon sx={{ mr: 0.5 }} fontSize="inherit" />}
              {item.label}
            </Link>
          )
        )}
      </Breadcrumbs>
    </Box>
  );
};

export default BreadcrumbNav;
