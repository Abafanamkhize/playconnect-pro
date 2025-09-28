const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Player = sequelize.define('Player', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: false
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false
  },
  federationId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  stats: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  videos: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  tableName: 'players'
});

module.exports = Player;
