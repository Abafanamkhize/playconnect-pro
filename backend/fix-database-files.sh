#!/bin/bash

# Fix database.js
cat > config/database.js << 'DB_EOF'
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'playconnect',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

testConnection();

module.exports = sequelize;
DB_EOF

# Fix Player.js
cat > models/Player.js << 'PLAYER_EOF'
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Player = sequelize.define('Player', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false
  },
  height: {
    type: DataTypes.FLOAT,
    validate: {
      min: 100,
      max: 250
    }
  },
  weight: {
    type: DataTypes.FLOAT,
    validate: {
      min: 30,
      max: 200
    }
  },
  skills: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  performanceStats: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  federationId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  verificationStatus: {
    type: DataTypes.ENUM('pending', 'verified', 'rejected'),
    defaultValue: 'pending'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'players',
  timestamps: true,
  indexes: [
    {
      fields: ['federationId']
    },
    {
      fields: ['verificationStatus']
    },
    {
      fields: ['position']
    }
  ]
});

module.exports = Player;
PLAYER_EOF

# Fix Federation.js
cat > models/Federation.js << 'FEDERATION_EOF'
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Federation = sequelize.define('Federation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  verificationLevel: {
    type: DataTypes.ENUM('basic', 'verified', 'premium'),
    defaultValue: 'basic'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'federations',
  timestamps: true
});

module.exports = Federation;
FEDERATION_EOF

# Fix User.js
cat > models/User.js << 'USER_EOF'
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('federation_admin', 'scout', 'player', 'system_admin'),
    allowNull: false
  },
  federationId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;
USER_EOF

# Fix init.js
cat > models/init.js << 'INIT_EOF'
const sequelize = require('../config/database');
const Player = require('./Player');
const Federation = require('./Federation');
const User = require('./User');

// Define associations
Federation.hasMany(Player, {
  foreignKey: 'federationId',
  as: 'players'
});

Player.belongsTo(Federation, {
  foreignKey: 'federationId',
  as: 'federation'
});

Federation.hasMany(User, {
  foreignKey: 'federationId',
  as: 'users'
});

User.belongsTo(Federation, {
  foreignKey: 'federationId',
  as: 'federation'
});

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('✅ Database synced successfully');
    
    // Create test federation if none exists
    const federationCount = await Federation.count();
    if (federationCount === 0) {
      await Federation.create({
        name: 'Test Sports Federation',
        country: 'South Africa',
        contactEmail: 'admin@testfederation.co.za',
        verificationLevel: 'verified'
      });
      console.log('✅ Test federation created');
    }
    
  } catch (error) {
    console.error('❌ Database sync failed:', error);
  }
};

module.exports = {
  sequelize,
  Player,
  Federation,
  User,
  syncDatabase
};
INIT_EOF

echo "✅ All database files fixed successfully!"
