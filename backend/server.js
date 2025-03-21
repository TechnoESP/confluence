require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Conectado"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("API funcionando"));

const SeguroSchema = new mongoose.Schema({
  tomador: {
    nombre: String,
    apellidos: String,
    dni: String,
    fechaNacimiento: String,
    fechaCarne: String,
    direccion: String,
    cp: String,
    localidad: String,
    provincia: String,
    matricula: String,
    marca: String,
    modelo: String,
    acabado: String,
    puertas: String,
    color: String,
    tieneSeguro: String,
    compania: String,
    numPoliza: String,
  },
  propietario: {
    nombre: String,
    apellidos: String,
    dni: String,
    fechaNacimiento: String,
    fechaCarne: String,
  },
  conductor: {
    nombre: String,
    apellidos: String,
    dni: String,
    fechaNacimiento: String,
    fechaCarne: String,
  },
});

const Seguro = mongoose.model("Seguro", SeguroSchema);

app.post("/seguroCoche", async (req, res) => {
  try {
    const nuevoSeguro = new Seguro(req.body);
    await nuevoSeguro.save();
    res.status(201).json({ message: "Seguro guardado con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar el seguro" });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
