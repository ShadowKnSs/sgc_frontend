import React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { Home as HomeIcon, NavigateNext as NavigateNextIcon } from '@mui/icons-material';

const BreadcrumbNav = ({ items }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
      >
        <Link
          color="inherit"
          href="/"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Inicio
        </Link>
        
        {items.map((item, index) => 
          index === items.length - 1 ? (
            <Typography
              key={index}
              color="text.primary"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              {item.icon && <item.icon sx={{ mr: 0.5 }} fontSize="inherit" />}
              {item.label}
            </Typography>
          ) : (
            <Link
              key={index}
              color="inherit"
              href={item.href}
              sx={{ display: 'flex', alignItems: 'center' }}
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