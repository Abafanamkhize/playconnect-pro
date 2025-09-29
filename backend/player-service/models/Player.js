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
      notEmpty: true
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: false
  },
  nationality: {
    type: DataTypes.STRING,
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
    type: DataTypes.JSON,
    defaultValue: {}
  },
  performanceStats: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  videos: {
    type: DataTypes.JSON,
    defaultValue: []
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
  timestamps: true,
  indexes: [
    {
      fields: ['firstName', 'lastName']
    },
    {
      fields: ['position']
    },
    {
      fields: ['verificationStatus']
    }
  ]
});

module.exports = Player;
