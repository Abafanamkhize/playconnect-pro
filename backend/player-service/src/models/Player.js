import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Player = sequelize.define('Player', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'id'
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'firstName'
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'lastName'
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'age'
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'position'
  },
  region: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'region'
  },
  federationId: {
    type: DataTypes.STRING,  // Note: This is string in your table, not UUID
    allowNull: false,
    field: 'federationId'
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'isVerified'
  },
  performanceScore: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
    field: 'performanceScore'
  }
}, {
  tableName: 'players',
  timestamps: true,
  underscored: false,  // Your columns use camelCase
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

export default Player;
