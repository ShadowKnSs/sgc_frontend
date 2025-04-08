import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import '../css/Layout.css';

const Layout = () => {
  const location = useLocation();

  const hideHeader = location.pathname === '/login';
  const showFooter = location.pathname === '/';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!hideHeader && <Header />}
      <div style={{ flexGrow: 1 }}>
        <Outlet />
      </div>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
