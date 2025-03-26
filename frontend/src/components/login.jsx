import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js"; // Importa la instancia de Axios con los interceptores
import "../styles.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usuario: "",
    contrasena: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await api.post("/login", formData);
      const { token, refreshToken, admin, codigoAgente } = response.data;
  
      // Guarda los tokens y nuevos datos en el almacenamiento local
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("admin", admin);
      localStorage.setItem("codigoAgente", codigoAgente);
  
      navigate("/seguroCoche"); // Redirige al formulario de seguro
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
      console.error("Error en el login:", err);
    }
  };  

  return (
    <div>
      <div className="form-container">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuario</label>
            <input
              type="text"
              name="usuario"
              placeholder="Usuario"
              value={formData.usuario}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="contrasena"
              placeholder="Contraseña"
              value={formData.contrasena}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Iniciar Sesión
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
