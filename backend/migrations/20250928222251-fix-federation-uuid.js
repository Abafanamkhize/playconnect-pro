'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop and recreate Federation table with UUID id
    await queryInterface.dropTable('Federations');
    
    await queryInterface.createTable('Federations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false
      },
      verificationStatus: {
        type: Sequelize.ENUM('pending', 'verified', 'suspended'),
        defaultValue: 'pending'
      },
      sports: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      contactEmail: {
        type: Sequelize.STRING,
        allowNull: false
      },
      adminUsers: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      revenueShare: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
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
    await queryInterface.dropTable('Federations');
  }
};
