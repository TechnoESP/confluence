import React from "react";
import { Link } from "react-router-dom";
import "../styles.css";

const Navbar = ({ isLoggedIn, handleLogout }) => {
  return (
    <nav className="navbar">
      <div className="left-side">
        <Link to="/" className="navbar-logo">
          <img src="/confluencegroup.png" alt="Logo" className="logo-image" />
        </Link>
        <div className="navbar-links">
          <div className="separator"></div>
          <Link to="/seguroCoche" className="seguroCoche-link">Seguro Coche</Link>
          <div className="separator"></div>
        </div>
      </div>
      <div className="right-side">
        <button
          className={
            isLoggedIn ? "bg-red-500 text-white px-4 py-2" : "bg-blue-500 text-white px-4 py-2"
          }
          onClick={handleLogout}
        >
          {isLoggedIn ? "Cerrar sesión" : "Iniciar sesión"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
