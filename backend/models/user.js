static associate(models) {
  // User belongs to Federation (for admin users)
  User.belongsTo(models.Federation, {
    foreignKey: 'federationId',
    as: 'federation'
  });
}
