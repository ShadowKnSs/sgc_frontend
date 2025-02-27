import React, { useRef } from "react";
import { Box, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import PageButton from "./PageButton";

const ButtonScrollNav = ({ buttons, activeButton, setActiveButton, handleButtonClick }) => {
  const buttonContainerRef = useRef(null);

  const handleScroll = (direction) => {
    if (buttonContainerRef.current) {
      buttonContainerRef.current.scrollLeft += direction === "left" ? -260 : 260;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        marginBottom: "20px",
        marginTop: "40px",
      }}
    >
      {/* Botón de desplazamiento a la izquierda */}
      <IconButton
        onClick={() => handleScroll("left")}
        sx={{
          border: "2px solid #00B2E3",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#00B2E3",
          "&:hover": {
            backgroundColor: "#00B2E3",
            color: "white",
          },
        }}
      >
        <ArrowBackIos sx={{ fontSize: "24px", marginLeft: "10px" }} />
      </IconButton>

      {/* Contenedor de botones con scroll */}
      <Box
        ref={buttonContainerRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          gap: "10px",
          padding: "5px",
          maxWidth: "87.6%",
          whiteSpace: "nowrap",
        }}
      >
        {buttons.map((label) => (
          <Box key={label} onClick={(event) => handleButtonClick(event, label)}>
            <PageButton
              label={label}
              active={activeButton === label}
              onClick={() => setActiveButton(label)}
            />
          </Box>
        ))}
      </Box>

      {/* Botón de desplazamiento a la derecha */}
      <IconButton
        onClick={() => handleScroll("right")}
        sx={{
          border: "2px solid #00B2E3",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#00B2E3",
          "&:hover": {
            backgroundColor: "#00B2E3",
            color: "white",
          },
        }}
      >
        <ArrowForwardIos sx={{ fontSize: "24px", marginLeft: "3px" }} />
      </IconButton>
    </Box>
  );
};

export default ButtonScrollNav;
