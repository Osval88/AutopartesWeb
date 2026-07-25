const express = require("express");
const path = require("path");
const productRoutes = require("./routes/productRoutes");
require("dotenv").config();
const session = require('express-session');
const passport = require('./config/passport'); 
const paypalRoutes = require('./routes/paypal');
const sequelize = require('./config/db');
const Usuario = require('./models/Usuario');
const Orden = require('./models/Orden');
const Producto = require('./models/Producto');
const authRoutes = require('./routes/authRoutes');
const Contacto = require('./models/Contacto');
const contactoRoutes = require('./routes/contactoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// 1. Relación Uno a Muchos: Un Usuario tiene muchas Órdenes
Usuario.hasMany(Orden, { foreignKey: 'usuarioId' });
Orden.belongsTo(Usuario, { foreignKey: 'usuarioId' });

// 2. Relación Muchos a Muchos: Una Orden tiene muchos Productos y viceversa
Orden.belongsToMany(Producto, { through: 'OrdenProductos', foreignKey: 'ordenId' });
Producto.belongsToMany(Orden, { through: 'OrdenProductos', foreignKey: 'productoId' });

// -------------------------------------------------------------
// Configuración de la sesión del usuario
app.use(session({
    secret: 'una_clave_secreta_para_tu_app_autopartes', 
    resave: false,
    saveUninitialized: false
}));

// Inicializar Passport y conectar las sesiones
app.use(passport.initialize());
app.use(passport.session());

// Enrutadores principales de la API
app.use("/api/products", productRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contacto', contactoRoutes);

async function probarConexion() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a MySQL establecida con éxito vía Sequelize.');
    
    await sequelize.sync({ alter: true }); 
    console.log('Tablas y relaciones sincronizadas correctamente.');
    
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
}

probarConexion();

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});