const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Player = sequelize.define('Player', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  weight: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nationality: {
    type: DataTypes.STRING,
    allowNull: false
  },
  skills: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  physical: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  team: {
    type: DataTypes.STRING,
    allowNull: false
  },
  value: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  highlights: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  talentScore: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  potential: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'players',
  timestamps: true
});

module.exports = Player;
