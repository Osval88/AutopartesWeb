const express = require('express');
const router = express.Router();
const Contacto = require('../models/Contacto');

router.post('/', async (req, res) => {
    const { nombre, apellido, mail, mensaje } = req.body;

    if (!nombre || !mail || !mensaje) {
        return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    try {
        const nuevoMensaje = await Contacto.create({
            nombre,
            apellido,
            mail,
            mensaje
        });

        console.log("📩 Mensaje guardado en la DB:", nuevoMensaje.id);
        res.status(200).json({ mensaje: "¡Mensaje recibido y guardado con éxito!" });
    } catch (error) {
        console.error("Error al procesar el formulario de contacto:", error);
        res.status(500).json({ error: "Error interno del servidor al guardar el mensaje." });
    }
});

module.exports = router;