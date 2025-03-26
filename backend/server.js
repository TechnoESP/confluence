const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Conexión a MongoDB con Mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Conectado"))
  .catch(err => console.log(err));

// Esquema de Usuario
const UsuarioSchema = new mongoose.Schema({
  nombre: String,
  codigoAgente: { type: String, unique: true },
  contrasena: String,
  lastIP: String,
  fechaRegistro: { type: Date, default: Date.now }
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

// Funciones auxiliares
async function comparePasswords(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

function getClientIP(req) {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  return req.ip;
}

// Middleware de autenticación
const verifyToken = (req, res, next) => {
  console.log("Entra en verifyToken");

  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Acceso no autorizado, token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, "132ac8588eb84fb1580a34f87b8bfb628eababf8d1ddff7e309a85b278fd02e659492c0ca4b4b67a6dedb48d481eb9c72f98ae246792629bef65236a9ccc79027c7615e5213a1f780714961f1ab97a52f5f04fba787ee4a58cecd510bdb5960e7b5acd15bf3537eac3c5f432ee2397c9c02a99493f6a6cda64bae07c594ed31d14dccd5b5e9574702257bf541e7a23294dd266a3f05b43d148463bb29b2e96f1cf7c7f31ca3c9ce3f19a53802087b7e8374e0a0fc6ca97f60f5fa813c7b43ca1360f56cafc657f0d0e2042920729e4f980be6d0e222d35e1d6a8ffce8e5ed289047cabc4d3f665769d420bb5c90873d2c4477f125dbac2180babd173ffb21a3e");
    req.user = decoded; // Guardamos los datos del usuario en el request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido, inicie sesión nuevamente' });
  }
};

// Rutas
app.get("/", (req, res) => res.send("API funcionando"));

app.post('/crearUsuario', async (req, res) => {
  console.log('ENTRA EN /crearUsuario');

  const { nombre, codigoAgente, contrasena } = req.body;

  if (!nombre || !codigoAgente || !contrasena) {
    return res.status(400).json({ message: 'Se requieren nombre, código de agente y contraseña' });
  }

  if (nombre.length < 4 || nombre.length > 20 || codigoAgente.length < 4 || codigoAgente.length > 20) {
    return res.status(400).json({ message: 'El nombre y código de agente deben tener entre 4 y 20 caracteres' });
  }

  if (contrasena.length < 6 || contrasena.length > 50) {
    return res.status(400).json({ message: 'La contraseña debe tener entre 6 y 50 caracteres' });
  }

  try {
    const existingUser = await Usuario.findOne({ codigoAgente });
    if (existingUser) {
      return res.status(400).json({ message: 'El código de agente ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const nuevoUsuario = new Usuario({
      nombre,
      codigoAgente,
      contrasena: hashedPassword
    });

    await nuevoUsuario.save();

    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.post('/login', async (req, res) => {
  console.log('ENTRA EN /login');

  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) {
    return res.status(400).json({ message: 'Debe proporcionar usuario y contraseña' });
  }

  try {
    // Convertir el usuario a minúsculas para la búsqueda exacta
    const user = await Usuario.findOne({ nombre: usuario.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña
    const passwordMatch = await comparePasswords(contrasena, user.contrasena);
    if (!passwordMatch) {
      return res.status(403).json({ message: 'Contraseña incorrecta' });
    }

    // Generar tokens con el usuario y el rol de admin
    const secretKey = "132ac8588eb84fb1580a34f87b8bfb628eababf8d1ddff7e309a85b278fd02e659492c0ca4b4b67a6dedb48d481eb9c72f98ae246792629bef65236a9ccc79027c7615e5213a1f780714961f1ab97a52f5f04fba787ee4a58cecd510bdb5960e7b5acd15bf3537eac3c5f432ee2397c9c02a99493f6a6cda64bae07c594ed31d14dccd5b5e9574702257bf541e7a23294dd266a3f05b43d148463bb29b2e96f1cf7c7f31ca3c9ce3f19a53802087b7e8374e0a0fc6ca97f60f5fa813c7b43ca1360f56cafc657f0d0e2042920729e4f980be6d0e222d35e1d6a8ffce8e5ed289047cabc4d3f665769d420bb5c90873d2c4477f125dbac2180babd173ffb21a3e";
    const token = jwt.sign(
      { usuario: user.usuario, admin: user.admin }, 
      secretKey, 
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { usuario: user.usuario }, 
      secretKey, 
      { expiresIn: '90d' }
    );

    // Actualizar la IP del último acceso
    await Usuario.updateOne({ usuario: user.usuario }, { $set: { lastIP: getClientIP(req) } });

    // Devolver tokens, admin y codigoAgente
    return res.status(200).json({ 
      token, 
      refreshToken, 
      admin: user.admin, 
      codigoAgente: user.codigoAgente 
    });

  } catch (error) {
    console.error('Error en el login:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});


app.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;
  console.log("Entra en refresh token");

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(refreshToken, "132ac8588eb84fb1580a34f87b8bfb628eababf8d1ddff7e309a85b278fd02e659492c0ca4b4b67a6dedb48d481eb9c72f98ae246792629bef65236a9ccc79027c7615e5213a1f780714961f1ab97a52f5f04fba787ee4a58cecd510bdb5960e7b5acd15bf3537eac3c5f432ee2397c9c02a99493f6a6cda64bae07c594ed31d14dccd5b5e9574702257bf541e7a23294dd266a3f05b43d148463bb29b2e96f1cf7c7f31ca3c9ce3f19a53802087b7e8374e0a0fc6ca97f60f5fa813c7b43ca1360f56cafc657f0d0e2042920729e4f980be6d0e222d35e1d6a8ffce8e5ed289047cabc4d3f665769d420bb5c90873d2c4477f125dbac2180babd173ffb21a3e");
    const newAccessToken = jwt.sign({ codigoAgente: decoded.codigoAgente }, "132ac8588eb84fb1580a34f87b8bfb628eababf8d1ddff7e309a85b278fd02e659492c0ca4b4b67a6dedb48d481eb9c72f98ae246792629bef65236a9ccc79027c7615e5213a1f780714961f1ab97a52f5f04fba787ee4a58cecd510bdb5960e7b5acd15bf3537eac3c5f432ee2397c9c02a99493f6a6cda64bae07c594ed31d14dccd5b5e9574702257bf541e7a23294dd266a3f05b43d148463bb29b2e96f1cf7c7f31ca3c9ce3f19a53802087b7e8374e0a0fc6ca97f60f5fa813c7b43ca1360f56cafc657f0d0e2042920729e4f980be6d0e222d35e1d6a8ffce8e5ed289047cabc4d3f665769d420bb5c90873d2c4477f125dbac2180babd173ffb21a3e", { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ codigoAgente: decoded.codigoAgente }, "132ac8588eb84fb1580a34f87b8bfb628eababf8d1ddff7e309a85b278fd02e659492c0ca4b4b67a6dedb48d481eb9c72f98ae246792629bef65236a9ccc79027c7615e5213a1f780714961f1ab97a52f5f04fba787ee4a58cecd510bdb5960e7b5acd15bf3537eac3c5f432ee2397c9c02a99493f6a6cda64bae07c594ed31d14dccd5b5e9574702257bf541e7a23294dd266a3f05b43d148463bb29b2e96f1cf7c7f31ca3c9ce3f19a53802087b7e8374e0a0fc6ca97f60f5fa813c7b43ca1360f56cafc657f0d0e2042920729e4f980be6d0e222d35e1d6a8ffce8e5ed289047cabc4d3f665769d420bb5c90873d2c4477f125dbac2180babd173ffb21a3e", { expiresIn: '90d' });

    return res.status(200).json({ token: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    return res.status(401).json({ message: 'Refresh token inválido' });
  }
});

// Ruta protegida de ejemplo
app.get('/perfil', verifyToken, (req, res) => {
  res.json({ message: 'Acceso autorizado', user: req.user });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
