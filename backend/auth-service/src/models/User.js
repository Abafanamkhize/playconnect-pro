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
    type: DataTypes.DATE,
    field: 'updatedat'  // Match exact column name
  }
}, {
  tableName: 'users',
  timestamps: true,  // Let Sequelize handle timestamps
  underscored: false,  // We're explicitly defining field names
  createdAt: 'createdat',
  updatedAt: 'updatedat',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
});

// Instance method to check password
User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Instance method to sanitize user data
User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

export default User;
