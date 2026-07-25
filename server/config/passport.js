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
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        
        if (!email) {
            return done(new Error("Google no devolvió un email válido."), null);
        }

        let [usuario, creado] = await Usuario.findOrCreate({
            where: { email: email },
            defaults: {
                nombre: profile.displayName || 'Sin nombre',
                googleId: profile.id
            }
        });

        if (creado) {
            console.log('Nuevo usuario registrado vía Google:', usuario.email);
        } else if (!usuario.googleId) {
            usuario.googleId = profile.id;
            await usuario.save();
        }

        return done(null, usuario);
    } catch (error) {
        console.error("ERROR EN PASSPORT:", error);
        return done(error, null);
    }
}));

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