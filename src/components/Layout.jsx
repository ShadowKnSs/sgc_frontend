import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header'; // si tienes un header
import Footer from './Footer';
import '../css/Layout.css';

const Layout = () => {
  const location = useLocation();
  // Muestra el Footer únicamente en la ruta raíz "/"
  const showFooter = location.pathname === '/';
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ flexGrow: 1 }}>
        <Outlet />
      </div>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
