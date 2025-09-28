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
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    nationality: DataTypes.STRING,
    primaryPosition: DataTypes.STRING,
    secondaryPositions: DataTypes.JSON,
    sport: DataTypes.STRING,
    height: DataTypes.FLOAT,
    weight: DataTypes.FLOAT,
    stats: DataTypes.JSON,
    talentScore: DataTypes.FLOAT,
    potentialCeiling: DataTypes.FLOAT,
    technicalProficiency: DataTypes.FLOAT,
    mentalResilience: DataTypes.FLOAT,
    verificationStatus: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    verifiedBy: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Player',
  });
  return Player;
};
