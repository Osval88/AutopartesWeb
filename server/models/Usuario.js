const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // El archivo de conexión a la base de datos

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // No puede haber dos usuarios con el mismo email
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true // Por si en el futuro querés agregar login clásico
  }
}, {
  timestamps: true // Nos crea automáticamente createdAt y updatedAt
});

module.exports = Usuario;