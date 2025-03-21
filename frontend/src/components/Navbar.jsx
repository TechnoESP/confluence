import React from "react";
import { Link } from "react-router-dom";
import "../styles.css";

const Navbar = ({ isLoggedIn, handleLogout }) => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">Empresa</Link>
      <div>
        <Link to="/seguroCoche" className="text-white px-4">Seguro Coche</Link>
        <button
          className={
            isLoggedIn ? "bg-red-500 text-white px-4 py-2 ml-4" : "bg-blue-500 text-white px-4 py-2 ml-4"
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
