'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // First, create the new enum type
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Users_role_new" AS ENUM (
        'federation_admin', 
        'scout', 
        'player', 
        'system_admin'
      )
    `);
    
    // Then alter the column to use the new enum
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" 
      ALTER COLUMN "role" 
      TYPE "enum_Users_role_new" 
      USING "role"::text::"enum_Users_role_new"
    `);
    
    // Drop the old enum type
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_Users_role"
    `);
    
    // Rename the new enum to the original name
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Users_role_new" 
      RENAME TO "enum_Users_role"
    `);
    
    // Set default value
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" 
      ALTER COLUMN "role" 
      SET DEFAULT 'player'
    `);
  },

  async down(queryInterface, Sequelize) {
    // Revert to string type
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" 
      ALTER COLUMN "role" 
      TYPE VARCHAR(255)
    `);
    
    // Drop the enum type
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_Users_role"
    `);
  }
};
