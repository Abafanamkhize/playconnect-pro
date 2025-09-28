static associate(models) {
  // Federation relationship
  Player.belongsTo(models.Federation, { 
    foreignKey: 'verifiedBy', 
    as: 'federation'
  });
}
