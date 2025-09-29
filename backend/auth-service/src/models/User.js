import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import bcrypt from 'bcrypt';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'id'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    },
    field: 'email'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]
    },
    field: 'password'
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'scout',
    validate: {
      isIn: [['federation', 'scout', 'admin']]
    },
    field: 'role'
  },
  federationId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'federationid'  // Match exact column name
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isactive'  // Match exact column name
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'lastlogin'  // Match exact column name
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'createdat'  // Match exact column name
  },
  updatedAt: {
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

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
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('super_admin', 'federation_admin', 'team_coach', 'talent_scout', 'player'),
    allowNull: false,
    defaultValue: 'player'
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  federation_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'federations',
      key: 'id'
    }
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password_hash = await bcrypt.hash(user.password, 12);
      }
    }
  }
});

User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password_hash);
};

module.exports = User;
