import React, { useState } from "react";
import "../styles.css";

const SeguroCoche = () => {
  const [formData, setFormData] = useState({
    tomador: { nombre: "", apellidos: "", dni: "", fechaNacimiento: "", fechaCarne: "", direccion: "", cp: "", localidad: "", provincia: "", matricula: "", marca: "", modelo: "", acabado: "", puertas: "", color: "", tieneSeguro: "", compania: "", numPoliza: "" },
    propietario: { nombre: "", apellidos: "", dni: "", fechaNacimiento: "", fechaCarne: "" },
    conductor: { nombre: "", apellidos: "", dni: "", fechaNacimiento: "", fechaCarne: "" }
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const validarDNI = (dni) => /^[0-9]{8}[A-Z]$/.test(dni);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (!validarDNI(formData.tomador.dni) || !validarDNI(formData.propietario.dni) || !validarDNI(formData.conductor.dni)) {
      setError("DNI incorrecto");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/seguroCoche", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setMensaje("Enviado correctamente");
      } else {
        setError("Error al enviar");
      }
    } catch (err) {
      setError("Error de conexión");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Datos del Tomador</h2>
        <div className="form-group">
          <label>Nombre</label>
          <input type="text" placeholder="Nombre" value={formData.tomador.nombre} onChange={(e) => setFormData({ ...formData, tomador: { ...formData.tomador, nombre: e.target.value } })} />
        </div>
        <div className="form-group">
          <label>DNI</label>
          <input type="text" placeholder="DNI" value={formData.tomador.dni} onChange={(e) => setFormData({ ...formData, tomador: { ...formData.tomador, dni: e.target.value } })} />
        </div>
        <button type="submit" className="submit-button">Enviar</button>
        {mensaje && <p className="success-message">{mensaje}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default SeguroCoche;
