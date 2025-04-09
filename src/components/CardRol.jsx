// 📁 src/components/RolCard.jsx
import React, { useState } from 'react';
import { Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SchoolIcon from '@mui/icons-material/School';
import { motion, AnimatePresence } from 'framer-motion';

const iconos = {
  AdminPanelSettings: (color = 'primary') => <AdminPanelSettingsIcon sx={{ fontSize: 50 }} color={color} />, 
  School: (color = 'secondary') => <SchoolIcon sx={{ fontSize: 50 }} color={color} />,
};

const RolCard = ({ rol, onSelect }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (!clicked) {
      setClicked(true);
      setTimeout(() => onSelect(rol), 1000); // Espera que termine animación
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Card elevation={6} sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardActionArea onClick={handleClick} disabled={clicked}>
          <CardContent sx={{ textAlign: 'center', py: 4, position: 'relative', zIndex: 2 }}>
            <Box color={clicked ? '#fff' : 'inherit'}>
              {iconos[rol.icono] ? iconos[rol.icono](clicked ? 'inherit' : undefined) : iconos['AdminPanelSettings'](clicked ? 'inherit' : undefined)}
            </Box>
            <Typography variant="h6" sx={{ mt: 2, color: clicked ? '#fff' : 'inherit' }}>
              {rol.nombreRol}
            </Typography>
          </CardContent>
        </CardActionArea>

        {/* Overlay de animación de relleno de abajo hacia arriba */}
        <AnimatePresence>
          {clicked && (
            <motion.div
              initial={{ height: 0, bottom: 0 }}
              animate={{ height: '100%' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                backgroundColor: '#1976d2',
                zIndex: 1,
              }}
            />
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default RolCard;
