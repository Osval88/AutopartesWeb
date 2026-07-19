const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Usuario = require('../models/Usuario');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // 1. Buscamos si el usuario ya existe en nuestra base de datos por su email o googleId
        let usuario = await Usuario.findOne({ where: { email: profile.emails[0].value } });

        if (!usuario) {
            // 2. Si no existe, lo creamos automáticamente usando los datos que nos da Google
            usuario = await Usuario.create({
                nombre: profile.displayName,
                email: profile.emails[0].value,
            });
            console.log('Nuevo usuario registrado vía Google:', usuario.email);
        } else {
            console.log('Usuario existente logueado vía Google:', usuario.email);
        }

        // 3. Le decimos a Passport que todo salió bien y le pasamos el usuario
        return done(null, usuario);
    } catch (error) {
        return done(error, null);
    }
}));

// Estos dos métodos sirven para que Passport mantenga al usuario "guardado" en la sesión (cookies)
passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const usuario = await Usuario.findByPk(id);
        done(null, usuario);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;