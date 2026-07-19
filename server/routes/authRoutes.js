const express = require('express');
const router = express.Router();
const passport = require('passport');

// Ruta para iniciar sesión.
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Ruta de retorno (Callback).
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login-failure' }),
    (req, res) => {
        res.redirect('/');
    }
);

// Ruta para comprobar el estado de la autenticación desde el frontend
router.get('/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ loggedIn: true, user: req.user });
    } else {
        res.json({ loggedIn: false });
    }
});

const Orden = require('../models/Orden');

// Ruta para traer el historial de compras del usuario conectado
router.get('/mis-ordenes', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ mensaje: 'No autorizado. Por favor iniciá sesión.' });
    }

    try {
        const ordenes = await Orden.findAll({
            where: { usuarioId: req.user.id },
            order: [['createdAt', 'DESC']]
        });

        res.json(ordenes);

    } catch (error) {
        console.error('Error al traer el historial:', error);
        res.status(500).json({ mensaje: 'Error al obtener el historial de compras.' });
    }
});

// Ruta opcional para cerrar sesión
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
});

module.exports = router;