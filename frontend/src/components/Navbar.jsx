import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles.css";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("accessToken");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="left-side">
        <Link to="/seguroCoche" className="navbar-logo">
          <img src="/confluencegroup.png" alt="Logo" className="logo-image" />
        </Link>
        <div className="navbar-links">
          <div className="separator"></div>
          <Link to="/seguroCoche" className="seguroCoche-link">Seguro Coche</Link>
          <div className="separator"></div>
        </div>
      </div>

      <div className="right-side">
        {isLoggedIn ? (
          <button className="logout-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        ) : (
          <button className="login-button" onClick={() => navigate("/login")}>
            Iniciar sesión
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;