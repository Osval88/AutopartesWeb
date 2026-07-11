const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Producto = sequelize.define('Producto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    img: { // <--- CAMBIADO DE "imagen" A "img" PARA QUE SEA IGUAL AL JSON
        type: DataTypes.STRING,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10
    }
}, {
    tableName: 'productos',
    timestamps: false
});

module.exports = Producto;