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
    unique: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [2, 10]
    }
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sport: {
    type: DataTypes.STRING,
    allowNull: false
  },
  verificationLevel: {
    type: DataTypes.ENUM('basic', 'verified', 'premium'),
    defaultValue: 'basic'
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  adminUsers: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['country', 'sport']
    }
  ]
});

module.exports = Federation;
