'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // First, check if we need to drop and recreate
    const tableExists = await queryInterface.sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'Players'
      );
    `);
    
    if (tableExists[0][0].exists) {
      console.log('Dropping existing Players table...');
      await queryInterface.dropTable('Players');
    }
    
    // Create with proper UUID id
    await queryInterface.createTable('Players', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: false
      },
      nationality: {
        type: Sequelize.STRING,
        allowNull: false
      },
      primaryPosition: {
        type: Sequelize.STRING,
        allowNull: false
      },
      secondaryPositions: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      sport: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Soccer'
      },
      height: {
        type: Sequelize.FLOAT
      },
      weight: {
        type: Sequelize.FLOAT
      },
      stats: {
        type: Sequelize.JSON,
        defaultValue: {}
      },
      talentScore: {
        type: Sequelize.FLOAT
      },
      potentialCeiling: {
        type: Sequelize.FLOAT
      },
      technicalProficiency: {
        type: Sequelize.FLOAT
      },
      mentalResilience: {
        type: Sequelize.FLOAT
      },
      verificationStatus: {
        type: Sequelize.ENUM('pending', 'verified', 'rejected'),
        defaultValue: 'pending'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      verifiedBy: {
        type: Sequelize.UUID,
        allowNull: false
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
    
    console.log('Players table created with UUID id');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Players');
  }
};
