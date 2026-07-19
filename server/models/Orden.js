const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Orden = sequelize.define('Orden', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  paypalOrderId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // El ID de transacción que nos da PayPal
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'COMPLETED'
  }
}, {
  timestamps: true
});

module.exports = Orden;