// components/MenuDrawer.js
import {
  Drawer,
  List,
  ListItemText,
  Divider,
  Box,
  Typography,
  ListItemButton,
} from '@mui/material';

const MenuDrawer = ({ 
  open, 
  onClose, 
  itemsFiltrados, 
  tieneMultiplesRoles, 
  nombreCompleto, 
  rolActivo,
  colorPalette,
  navigate 
}) => {
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    onClose(open);
  };

  const menuList = (
    <Box sx={{ width: 280, height: '100%' }}>
      {/* Cabecera con información del usuario */}
      <Box sx={{ p: 2, textAlign: 'center', backgroundColor: colorPalette.azulOscuro }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "white" }}>
          {nombreCompleto || "Usuario"}
        </Typography>
        <Typography variant="body2" sx={{ color: "white", opacity: 0.8 }}>
          {rolActivo?.nombreRol || "Invitado"}
        </Typography>
      </Box>
      <Box sx={{ height: '8px', backgroundColor: colorPalette.azulCielo }} />
      <Divider />

      {/* Lista de items del menú */}
      <List>
        {tieneMultiplesRoles && (
          <ListItemButton
            onClick={() => {
              navigate("/seleccionarRol");
              onClose(false);
            }}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 1,
              my: 0.5,
              mx: 1,
              '&:hover': {
                backgroundColor: colorPalette.azulClaro,
                color: 'white',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <ListItemText
              primary="Cambiar Rol"
              primaryTypographyProps={{
                fontSize: 16,
                fontWeight: 500,
              }}
            />
          </ListItemButton>
        )}

        {itemsFiltrados.map((item, index) => (
          <ListItemButton
            key={index}
            onClick={() => {
              navigate(item.path);
              onClose(false);
            }}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 1,
              my: 0.5,
              mx: 1,
              '&:hover': {
                backgroundColor: colorPalette.azulClaro,
                color: 'white',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <ListItemText
              primary={item.title}
              primaryTypographyProps={{
                fontSize: 16,
                fontWeight: 500,
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer 
      anchor="left" 
      open={open} 
      onClose={toggleDrawer(false)}
      PaperProps={{
        sx: {
          backgroundColor: '#f5f5f5'
        }
      }}
    >
      {menuList}
    </Drawer>
  );
};

export default MenuDrawer;