const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const Contacto = sequelize.define('Contacto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'contactos', 
    timestamps: true       
});

module.exports = Contacto;