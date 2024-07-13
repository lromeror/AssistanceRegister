import React from 'react';
import './Header.css';  // Puedes agregar estilos personalizados aquí
import logo from './Logo_wids2024.png';  // Asegúrate de que la ruta sea correcta

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <img src={logo} className="header-logo" alt="logo" />
        <div className="header-text">
          <h1>ATTENDANCE REGISTER</h1>
          <h2>WiDS ESPOL 2024</h2>
        </div>
      </div>
    </header>
  );
};

export default Header;
