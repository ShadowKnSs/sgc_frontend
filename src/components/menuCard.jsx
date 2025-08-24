/**
 * Componente: MenuCard
 * Descripción:
 * Tarjeta visual interactiva que representa una opción del menú principal.
 * Muestra un ícono y un título centrado, y ejecuta una función `onClick` al hacer clic.
 * Opcionalmente, puede recibir un `idProceso` si es necesario pasarlo como argumento.
 * 
 * Uso:
 * <MenuCard 
 *    icon={<IconComponent />} 
 *    title="Mi Módulo" 
 *    onClick={() => navegarARuta()} 
 * />
 */

import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const MenuCard = ({ icon, title, onClick, idProceso }) => {
  // Maneja el clic en la tarjeta y llama a la función proporcionada (si existe)
  const handleClick = () => {
    if (onClick) {
      onClick(idProceso); // Si se proporciona idProceso, se pasa como argumento
    }
  };

  return (
    <Card
      onClick={handleClick}
      role="button"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: 200,
        height: 200,
        borderRadius: 3,
        boxShadow: 3,
        cursor: "pointer",
        backgroundColor: "primary.main",
        transition: "transform 0.3s ease-in-out, background-color 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",            // Aumenta ligeramente el tamaño al pasar el mouse
          backgroundColor: "secondary.main",   // Cambia el color de fondo al hacer hover
          boxShadow: 6,                        // Aumenta la sombra
        }
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        {/* Clona el ícono recibido y le aplica estilos de color y tamaño */}
        {React.cloneElement(icon, { sx: { color: "#FFFFFF", fontSize: 70 } })}

        {/* Título centrado debajo del ícono */}
        <Typography
          variant="subtitle1"
          sx={{
            marginTop: 1,
            fontWeight: "bold",
            color: "#FFF",
            textAlign: "center"
          }}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MenuCard;
