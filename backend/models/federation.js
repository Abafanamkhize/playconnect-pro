'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Federation extends Model {
    static associate(models) {
      Federation.hasMany(models.Player, { 
        foreignKey: 'verifiedBy',
        as: 'players'
      });
    }
  }
  Federation.init({
    name: DataTypes.STRING,
    country: DataTypes.STRING,
    verificationStatus: DataTypes.STRING,
    sports: DataTypes.JSON,
    contactEmail: DataTypes.STRING,
    adminUsers: DataTypes.JSON,
    revenueShare: DataTypes.FLOAT,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Federation',
  });
  return Federation;
};
