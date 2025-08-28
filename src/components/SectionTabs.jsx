// components/SectionTabs.jsx
import React from "react";
import { Box, Button } from "@mui/material";

const SectionTabs = ({ sections, selectedTab, onTabChange }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      gap: 1,
      p: 1,
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
      mb: 3,
      flexWrap: "wrap",
    }}
  >
    {sections.map((section, index) => (
      <Button
        key={index}
        onClick={() => onTabChange(index)}
        disableElevation
        sx={{
          px: 3,
          py: 1.5,
          fontSize: "0.95rem",
          fontWeight: selectedTab === index ? "bold" : "normal",
          borderRadius: "8px",
          textTransform: "none",
          color: selectedTab === index ? "#fff" : "#185FA4",
          backgroundColor: selectedTab === index ? "#68A2C9" : "#ffffff",
          border: selectedTab === index ? "none" : "1px solid #185FA4",
          boxShadow: selectedTab === index ? "0px 4px 10px rgba(24, 95, 164, 0.3)" : "none",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: selectedTab === index ? "#68A2DA" : "#f0f6fc",
          }
        }}
      >
        {section}
      </Button>
    ))}
  </Box>
);

export default SectionTabs;
