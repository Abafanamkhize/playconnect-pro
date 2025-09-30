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
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false
  },
  height: {
    type: DataTypes.FLOAT,
    validate: {
      min: 100,
      max: 250
    }
  },
  weight: {
    type: DataTypes.FLOAT,
    validate: {
      min: 30,
      max: 200
    }
  },
  skills: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  performanceStats: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  federationId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  verificationStatus: {
    type: DataTypes.ENUM('pending', 'verified', 'rejected'),
    defaultValue: 'pending'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'players',
  timestamps: true,
  indexes: [
    {
      fields: ['federationId']
    },
    {
      fields: ['verificationStatus']
    },
    {
      fields: ['position']
    }
  ]
});

module.exports = Player;
