static associate(models) {
  Federation.hasMany(models.Player, { 
    foreignKey: 'verifiedBy',
    as: 'players'
  });
}
