// components/MenuDrawer.js
import {
  Drawer,
  List,
  ListItemText,
  Divider,
  Box,
  Typography,
  ListItemButton,
  ListItemIcon,
} from '@mui/material';

const MenuDrawer = ({
  open,
  onClose,
  itemsFiltrados,
  tieneMultiplesRoles,
  nombreCompleto,
  rolActivo,
  colorPalette,
  navigate,
  onDisabledClick, // <- NUEVO (opcional)
}) => {
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    onClose(open);
  };

  const handleItemClick = (item) => {
    const isDisabled = Boolean(item.disabled || !item.path);
    if (isDisabled) {
      onDisabledClick?.(item); // muestra snackbar si lo pasas desde Header
      return;
    }
    navigate(item.path);
    onClose(false);
  };

  const menuList = (
    <Box sx={{ width: 280, height: '100%' }}>
      {/* Cabecera */}
      <Box sx={{ p: 2, textAlign: 'center', backgroundColor: colorPalette.azulOscuro }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
          {nombreCompleto || 'Usuario'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'white', opacity: 0.8 }}>
          {rolActivo?.nombreRol || 'Invitado'}
        </Typography>
      </Box>
      <Box sx={{ height: '8px', backgroundColor: colorPalette.azulCielo }} />
      <Divider />

      {/* Lista */}
      <List>
        {tieneMultiplesRoles && (
          <ListItemButton
            onClick={() => {
              navigate('/seleccionarRol');
              onClose(false);
            }}
            sx={{
              px: 3, py: 1.5, borderRadius: 1, my: 0.5, mx: 1,
              '&:hover': { backgroundColor: colorPalette.azulClaro, color: 'white' },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <ListItemText
              primary="Cambiar Rol"
              primaryTypographyProps={{ fontSize: 16, fontWeight: 500 }}
            />
          </ListItemButton>
        )}

        {itemsFiltrados.map((item, index) => {
          const isDisabled = Boolean(item.disabled || !item.path);
          return (
            <ListItemButton
              key={index}
              disabled={isDisabled}
              aria-disabled={isDisabled}
              onClick={() => handleItemClick(item)}
              sx={{
                px: 3, py: 1.5, borderRadius: 1, my: 0.5, mx: 1,
                '&:hover': { backgroundColor: colorPalette.azulClaro, color: 'white' },
                transition: 'all 0.2s ease-in-out',
                '&.Mui-disabled': {
                  opacity: 0.6,
                  cursor: 'not-allowed',
                },
              }}
            >
              {item.icon && <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>}
              <ListItemText
                primary={item.title}
                secondary={isDisabled ? (item.hint || 'Elemento deshabilitado') : undefined}
                primaryTypographyProps={{ fontSize: 16, fontWeight: 500 }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={toggleDrawer(false)}
      PaperProps={{ sx: { backgroundColor: '#f5f5f5' } }}
    >
      {menuList}
    </Drawer>
  );
};

export default MenuDrawer;
