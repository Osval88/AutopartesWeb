const express = require("express");
const path = require("path");
require('dotenv').config();  // Carga las variables antes que nada
const cors = require("cors");
const app = express();
// Si process.env.PORT no existe, usa el 3000 por defecto
const PORT = process.env.PORT || 3000;


// Middlewares (Configuraciones)
app.use(cors()); // Esto permite que tu frontend se comunique con el backend
// permitir JSON
app.use(express.json());

// servir archivos estáticos
app.use(express.static(path.join(__dirname, "..", "public")));


// Encendido del servidor (Siempre al final)
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});