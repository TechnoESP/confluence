import React, { useState } from "react";
import "../styles.css";

const SeguroCoche = () => {
  const [formData, setFormData] = useState({
    codigoAgente: "", // Nuevo campo independiente
    tomador: {
      nombre: "",
      apellidos: "",
      tipoDocumento: "DNI", // Nuevo: Puede ser "DNI", "NIE" o "CIF"
      documento: "", // Reemplaza "dni" para admitir diferentes tipos de documento
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
      numPuertas: 2,
      color: "",
      tieneSeguro: "",
      compania: "",
      numPoliza: "",
      esPropietario: false, // Checkbox: ¿Tomador es propietario?
      esConductor: false // Checkbox: ¿Tomador es conductor?
    },
    propietario: {
      nombre: "",
      apellidos: "",
      tipoDocumento: "DNI",
      documento: "",
      fechaNacimiento: "",
      fechaCarne: ""
    },
    conductor: {
      nombre: "",
      apellidos: "",
      tipoDocumento: "DNI",
      documento: "",
      fechaNacimiento: "",
      fechaCarne: ""
    }
  });
  

  const [mostrarPropietario, setMostrarPropietario] = useState(false);
  const [mostrarConductor, setMostrarConductor] = useState(false);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const validarDNI = (dni) => /^[0-9]{8}[A-Z]$/.test(dni);
  const validarNIE = (nie) => /^[XYZ][0-9]{7}[A-Z]$/.test(nie);
  const validarCIF = (cif) => /^[A-Z][0-9]{7}[A-Z0-9]$/.test(cif);

  const validarCamposObligatorios = () => {
    const { tomador, propietario, conductor } = formData;
  
    // Validar campos obligatorios del tomador
    const camposTomadorObligatorios = [
      "nombre",
      "apellidos",
      "tipoDocumento",
      "documento",
      "fechaNacimiento",
      "fechaCarne",
      "direccion",
      "cp",
      "localidad",
      "provincia",
      "matricula",
      "marca",
      "modelo",
      "acabado",
      "numPuertas",
      "color"
    ];
  
    for (const campo of camposTomadorObligatorios) {
      if (!tomador[campo]) return `El campo ${campo} del tomador es obligatorio.`;
    }
  
    // Validar documento según el tipo (DNI, NIE o CIF)
    if (
      (tomador.tipoDocumento === "DNI" && !validarDNI(tomador.documento)) ||
      (tomador.tipoDocumento === "NIE" && !validarNIE(tomador.documento)) ||
      (tomador.tipoDocumento === "CIF" && !validarCIF(tomador.documento))
    ) {
      return "Documento del tomador no es válido.";
    }
  
    // Validar compañía y nº de póliza si tiene seguro
    if (tomador.tieneSeguro === "si" && (!tomador.compania || !tomador.numPoliza)) {
      return "Si tiene seguro, debe indicar la compañía y el nº de póliza.";
    }
  
    // Validar campos del propietario si está activado
    if (mostrarPropietario) {
      const camposPropietarioObligatorios = [
        "nombre",
        "apellidos",
        "tipoDocumento",
        "documento",
        "fechaNacimiento",
        "fechaCarne"
      ];
  
      for (const campo of camposPropietarioObligatorios) {
        if (!propietario[campo]) return `El campo ${campo} del propietario es obligatorio.`;
      }
  
      if (
        (propietario.tipoDocumento === "DNI" && !validarDNI(propietario.documento)) ||
        (propietario.tipoDocumento === "NIE" && !validarNIE(propietario.documento)) ||
        (propietario.tipoDocumento === "CIF" && !validarCIF(propietario.documento))
      ) {
        return "Documento del propietario no es válido.";
      }
    }
  
    // Validar campos del conductor si está activado
    if (mostrarConductor) {
      const camposConductorObligatorios = [
        "nombre",
        "apellidos",
        "tipoDocumento",
        "documento",
        "fechaNacimiento",
        "fechaCarne"
      ];
  
      for (const campo of camposConductorObligatorios) {
        if (!conductor[campo]) return `El campo ${campo} del conductor es obligatorio.`;
      }
  
      if (
        (conductor.tipoDocumento === "DNI" && !validarDNI(conductor.documento)) ||
        (conductor.tipoDocumento === "NIE" && !validarNIE(conductor.documento)) ||
        (conductor.tipoDocumento === "CIF" && !validarCIF(conductor.documento))
      ) {
        return "Documento del conductor no es válido.";
      }
    }
  
    return null; // Todo es válido
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
  
    // Validar campos obligatorios
    const mensajeError = validarCamposObligatorios();
    if (mensajeError) {
      setError(mensajeError);
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/seguroCoche", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
  

  const handleCheckboxChange = (section) => {
    if (section === "propietario") {
      setMostrarPropietario(!mostrarPropietario);
      if (!mostrarPropietario) {
        setFormData({ ...formData, propietario: { nombre: "", apellidos: "", dni: "", fechaNacimiento: "", fechaCarne: "" } });
      }
    }
    if (section === "conductor") {
      setMostrarConductor(!mostrarConductor);
      if (!mostrarConductor) {
        setFormData({ ...formData, conductor: { nombre: "", apellidos: "", dni: "", fechaNacimiento: "", fechaCarne: "" } });
      }
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
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
          <label>Tipo de documento</label>
          <select
            value={formData.tomador.tipoDocumento}
            onChange={(e) =>
              setFormData({
                ...formData,
                tomador: { ...formData.tomador, tipoDocumento: e.target.value, dni: "" },
              })
            }
          >
            <option value="">Seleccione</option>
            <option value="DNI">DNI</option>
            <option value="NIE">NIE</option>
            <option value="CIF">CIF</option>
          </select>
        </div>

        {formData.tomador.tipoDocumento && (
          <div className="form-group">
            <label>{formData.tomador.tipoDocumento}</label>
            <input
              type="text"
              placeholder={formData.tomador.tipoDocumento}
              value={formData.tomador.documento}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tomador: { ...formData.tomador, documento: e.target.value },
                })
              }
            />
          </div>
        )}

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
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,5}$/.test(value)) {
                setFormData({ ...formData, tomador: { ...formData.tomador, cp: value } });
              }
            }}
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
            <option value="Alicante">Alicante</option>
            <option value="Almería">Almería</option>
            <option value="Asturias">Asturias</option>
            <option value="Ávila">Ávila</option>
            <option value="Badajoz">Badajoz</option>
            <option value="Baleares">Baleares</option>
            <option value="Barcelona">Barcelona</option>
            <option value="Burgos">Burgos</option>
            <option value="Cáceres">Cáceres</option>
            <option value="Cádiz">Cádiz</option>
            <option value="Cantabria">Cantabria</option>
            <option value="Castellón">Castellón</option>
            <option value="Ceuta">Ceuta</option>
            <option value="Ciudad Real">Ciudad Real</option>
            <option value="Córdoba">Córdoba</option>
            <option value="Cuenca">Cuenca</option>
            <option value="Gerona">Gerona</option>
            <option value="Granada">Granada</option>
            <option value="Guadalajara">Guadalajara</option>
            <option value="Guipúzcoa">Guipúzcoa</option>
            <option value="Huelva">Huelva</option>
            <option value="Huesca">Huesca</option>
            <option value="Jaén">Jaén</option>
            <option value="La Coruña">La Coruña</option>
            <option value="La Rioja">La Rioja</option>
            <option value="Las Palmas">Las Palmas</option>
            <option value="León">León</option>
            <option value="Lérida">Lérida</option>
            <option value="Lugo">Lugo</option>
            <option value="Madrid">Madrid</option>
            <option value="Málaga">Málaga</option>
            <option value="Melilla">Melilla</option>
            <option value="Murcia">Murcia</option>
            <option value="Navarra">Navarra</option>
            <option value="Orense">Orense</option>
            <option value="Palencia">Palencia</option>
            <option value="Pontevedra">Pontevedra</option>
            <option value="Salamanca">Salamanca</option>
            <option value="Segovia">Segovia</option>
            <option value="Sevilla">Sevilla</option>
            <option value="Soria">Soria</option>
            <option value="Tarragona">Tarragona</option>
            <option value="Tenerife">Tenerife</option>
            <option value="Teruel">Teruel</option>
            <option value="Toledo">Toledo</option>
            <option value="Valencia">Valencia</option>
            <option value="Valladolid">Valladolid</option>
            <option value="Vizcaya">Vizcaya</option>
            <option value="Zamora">Zamora</option>
            <option value="Zaragoza">Zaragoza</option>
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

        {/* Checkbox para mostrar propietario */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={mostrarPropietario}
              onChange={() => handleCheckboxChange("propietario")}
            />
            El propietario es diferente al tomador
          </label>
        </div>

        {/* Sección de propietario condicional */}
        {mostrarPropietario && (
          <div>
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
          </div>
        )}

        {/* Checkbox para mostrar conductor */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={mostrarConductor}
              onChange={() => handleCheckboxChange("conductor")}
            />
            Añadir conductor ocasional
          </label>
        </div>

        {/* Sección de conductor condicional */}
        {mostrarConductor && (
          <div>
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
          </div>
        )}

        <button type="submit" className="submit-button">Enviar</button>

        {mensaje && <p className="success-message">{mensaje}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default SeguroCoche;
