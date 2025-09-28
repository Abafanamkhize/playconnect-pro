'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop the existing table
    await queryInterface.dropTable('Users');
    
    // Recreate with correct structure
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      passwordHash: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('federation_admin', 'scout', 'player', 'system_admin'),
        allowNull: false,
        defaultValue: 'player'
      },
      federationId: {
        type: Sequelize.UUID,
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
