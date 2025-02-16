import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; // si tienes un header
import Footer from './Footer';
import '../css/Layout.css';

const Layout = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
