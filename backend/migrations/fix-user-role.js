'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // First update any invalid role values to 'player'
    await queryInterface.sequelize.query(`
      UPDATE "Users" 
      SET "role" = 'player' 
      WHERE "role" NOT IN ('federation_admin', 'scout', 'player', 'system_admin')
    `);
    
    // Then alter the column with proper casting
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" 
      ALTER COLUMN "role" 
      TYPE VARCHAR(255)
    `);
    
    // Create the enum type
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Users_role" AS ENUM (
        'federation_admin', 
        'scout', 
        'player', 
        'system_admin'
      )
    `);
    
    // Convert to enum
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" 
      ALTER COLUMN "role" 
      TYPE "enum_Users_role" 
      USING "role"::"enum_Users_role"
    `);
    
    // Set default
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" 
      ALTER COLUMN "role" 
      SET DEFAULT 'player'
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" 
      ALTER COLUMN "role" 
      TYPE VARCHAR(255)
    `);
    
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_Users_role"
    `);
  }
};
