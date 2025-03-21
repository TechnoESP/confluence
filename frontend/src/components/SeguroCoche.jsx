import React, { useState } from "react";
import "../styles.css";

const SeguroCoche = () => {
  const [formData, setFormData] = useState({
    tomador: {
      nombre: "",
      apellidos: "",
      dni: "",
      fechaNacimiento: "",
      fechaCarne: "",
      direccion: "",
      cp: "",
      localidad: "",
      provincia: "",
      matricula: "",
      marca: "",
      modelo: "",
      acabado: "",
      numPuertas: 2, // Cambio de "puertas" a "numPuertas"
      color: "",
      tieneSeguro: "",
      compania: "",
      numPoliza: ""
    },
    propietario: {
      nombre: "",
      apellidos: "",
      dni: "",
      fechaNacimiento: "",
      fechaCarne: ""
    },
    conductor: {
      nombre: "",
      apellidos: "",
      dni: "",
      fechaNacimiento: "",
      fechaCarne: ""
    }
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const validarDNI = (dni) => /^[0-9]{8}[A-Z]$/.test(dni);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (
      !validarDNI(formData.tomador.dni) ||
      !validarDNI(formData.propietario.dni) ||
      !validarDNI(formData.conductor.dni)
    ) {
      setError("DNI incorrecto");
      return;
    }

    if (formData.tomador.tieneSeguro === "si") {
      if (!formData.tomador.compania || !formData.tomador.numPoliza) {
        setError("Compañía y Nº Póliza son obligatorios cuando tiene seguro.");
        return;
      }
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
        {/* Sección 1: Tomador */}
        <h2>Datos del Tomador</h2>
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            placeholder="Nombre"
            value={formData.tomador.nombre}
            onChange={(e) => setFormData({ ...formData, tomador: { ...formData.tomador, nombre: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label>Apellidos</label>
          <input
            type="text"
            placeholder="Apellidos"
            value={formData.tomador.apellidos}
            onChange={(e) => setFormData({ ...formData, tomador: { ...formData.tomador, apellidos: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label>DNI</label>
          <input
            type="text"
            placeholder="DNI"
            value={formData.tomador.dni}
            onChange={(e) => setFormData({ ...formData, tomador: { ...formData.tomador, dni: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label>Fecha Nacimiento</label>
          <input
            type="date"
            value={formData.tomador.fechaNacimiento}
            onChange={(e) => setFormData({ ...formData, tomador: { ...formData.tomador, fechaNacimiento: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label>Fecha Carnet</label>
          <input
            type="date"
            value={formData.tomador.fechaCarne}
            onChange={(e) => setFormData({ ...formData, tomador: { ...formData.tomador, fechaCarne: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label>Dirección</label>
          <input
            type="text"
            placeholder="Dirección"
            value={formData.tomador.direccion}
            onChange={(e) => setFormData({ ...formData, tomador: { ...formData.tomador, direccion: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label>Código Postal</label>
          <input
            type="text"
            placeholder="Código Postal"
            value={formData.tomador.cp}
            onChange={(e) => setFormData({ ...formData, tomador: { ...formData.tomador, cp: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label>Localidad</label>
          <input
            type="text"
            placeholder="Localidad"
            value={formData.tomador.localidad}
            onChange={(e) => setFormData({ ...formData, tomador: { ...formData.tomador, localidad: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label>Provincia</label>
          <select
            value={formData.tomador.provincia}
            onChange={(e) => setFormData({ ...formData, tomador: { ...formData.tomador, provincia: e.target.value } })}
          >
            <option value="">Elige Provincia</option>
            <option value="Álava">Álava</option>
            <option value="Albacete">Albacete</option>
            {/* Agrega el resto de las provincias */}
          </select>
        </div>
        <div className="form-group">
          <label>Matrícula</label>
          <input
            type="text"
            placeholder="Matrícula"
            value={formData.tomador.matricula}
            onChange={(e) => setFormData({ ...formData, tomador: { ...formData.tomador, matricula: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label>Marca</label>
          <input
            type="text"
            placeholder="Marca"
            value={formData.tomador.marca}
            onChange={(e) => setFormData({ ...formData, tomador: { ...formData.tomador, marca: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label>Modelo</label>
          <input
            type="text"
            placeholder="Modelo"
            value={formData.tomador.modelo}
            onChange={(e) => setFormData({ ...formData, tomador: { ...formData.tomador, modelo: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label>Acabado</label>
          <input
            type="text"
            placeholder="Acabado"
            value={formData.tomador.acabado}
            onChange={(e) => setFormData({ ...formData, tomador: { ...formData.tomador, acabado: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label>Nº de puertas</label>
          <input
            type="number"
            min="2"
            max="5"
            value={formData.tomador.numPuertas}
            onChange={(e) => setFormData({ ...formData, tomador: { ...formData.tomador, numPuertas: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label>Color</label>
          <input
            type="text"
            placeholder="Color"
            value={formData.tomador.color}
            onChange={(e) => setFormData({ ...formData, tomador: { ...formData.tomador, color: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label>Tiene Seguro</label>
          <select
            value={formData.tomador.tieneSeguro}
            onChange={(e) => setFormData({ ...formData, tomador: { ...formData.tomador, tieneSeguro: e.target.value } })}
          >
            <option value="">Seleccione</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        {/* Mostrar los campos Compañía y Nº Póliza solo si tiene seguro */}
        {formData.tomador.tieneSeguro === "si" && (
          <>
            <div className="form-group">
              <label>Compañía</label>
              <input
                type="text"
                placeholder="Compañía"
                value={formData.tomador.compania}
                onChange={(e) => setFormData({ ...formData, tomador: { ...formData.tomador, compania: e.target.value } })}
              />
            </div>
            <div className="form-group">
              <label>Nº Póliza</label>
              <input
                type="text"
                placeholder="Nº Póliza"
                value={formData.tomador.numPoliza}
                onChange={(e) => setFormData({ ...formData, tomador: { ...formData.tomador, numPoliza: e.target.value } })}
              />
            </div>
          </>
        )}

        {/* Sección 2: Propietario */}
        <h2>Datos del Propietario</h2>
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            placeholder="Nombre"
            value={formData.propietario.nombre}
            onChange={(e) => setFormData({ ...formData, propietario: { ...formData.propietario, nombre: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label>Apellidos</label>
          <input
            type="text"
            placeholder="Apellidos"
            value={formData.propietario.apellidos}
            onChange={(e) => setFormData({ ...formData, propietario: { ...formData.propietario, apellidos: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label>DNI</label>
          <input
            type="text"
            placeholder="DNI"
            value={formData.propietario.dni}
            onChange={(e) => setFormData({ ...formData, propietario: { ...formData.propietario, dni: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label>Fecha Nacimiento</label>
          <input
            type="date"
            value={formData.propietario.fechaNacimiento}
            onChange={(e) => setFormData({ ...formData, propietario: { ...formData.propietario, fechaNacimiento: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label>Fecha Carnet</label>
          <input
            type="date"
            value={formData.propietario.fechaCarne}
            onChange={(e) => setFormData({ ...formData, propietario: { ...formData.propietario, fechaCarne: e.target.value } })}
          />
        </div>

        {/* Sección 3: Conductor */}
        <h2>Datos del Conductor</h2>
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            placeholder="Nombre"
            value={formData.conductor.nombre}
            onChange={(e) => setFormData({ ...formData, conductor: { ...formData.conductor, nombre: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label>Apellidos</label>
          <input
            type="text"
            placeholder="Apellidos"
            value={formData.conductor.apellidos}
            onChange={(e) => setFormData({ ...formData, conductor: { ...formData.conductor, apellidos: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label>DNI</label>
          <input
            type="text"
            placeholder="DNI"
            value={formData.conductor.dni}
            onChange={(e) => setFormData({ ...formData, conductor: { ...formData.conductor, dni: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label>Fecha Nacimiento</label>
          <input
            type="date"
            value={formData.conductor.fechaNacimiento}
            onChange={(e) => setFormData({ ...formData, conductor: { ...formData.conductor, fechaNacimiento: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label>Fecha Carnet</label>
          <input
            type="date"
            value={formData.conductor.fechaCarne}
            onChange={(e) => setFormData({ ...formData, conductor: { ...formData.conductor, fechaCarne: e.target.value } })}
          />
        </div>

        <button type="submit" className="submit-button">Enviar</button>
        {mensaje && <p className="success-message">{mensaje}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default SeguroCoche;
