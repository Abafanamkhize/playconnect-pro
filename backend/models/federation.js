const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Federation = sequelize.define('Federation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  verificationLevel: {
    type: DataTypes.ENUM('basic', 'verified', 'premium'),
    defaultValue: 'basic'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'federations',
  timestamps: true
});

module.exports = Federation;
