'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    static associate(models) {
      Player.belongsTo(models.Federation, {
        foreignKey: 'verifiedBy',
        as: 'federation'
      });
    }
  }
  Player.init({
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
    nationality: {
      type: DataTypes.STRING,
      allowNull: false
    },
    primaryPosition: {
      type: DataTypes.STRING,
      allowNull: false
    },
    secondaryPositions: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    sport: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Soccer'
    },
    height: {
      type: DataTypes.FLOAT
    },
    weight: {
      type: DataTypes.FLOAT
    },
    stats: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    talentScore: {
      type: DataTypes.FLOAT
    },
    potentialCeiling: {
      type: DataTypes.FLOAT
    },
    technicalProficiency: {
      type: DataTypes.FLOAT
    },
    mentalResilience: {
      type: DataTypes.FLOAT
    },
    verificationStatus: {
      type: DataTypes.ENUM('pending', 'verified', 'rejected'),
      defaultValue: 'pending'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    verifiedBy: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Player',
  });
  return Player;
};
