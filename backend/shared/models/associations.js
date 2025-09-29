const Player = require('../../player-service/models/Player');
const Federation = require('../../federation-service/models/Federation');

const setupAssociations = () => {
  // Federation → Players (One-to-Many)
  Federation.hasMany(Player, {
    foreignKey: 'federationId',
    as: 'players'
  });
  
  Player.belongsTo(Federation, {
    foreignKey: 'federationId',
    as: 'federation'
  });
};

module.exports = setupAssociations;
