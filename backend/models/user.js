const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
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
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('super_admin', 'federation_admin', 'scout', 'player', 'coach'),
    allowNull: false,
    defaultValue: 'player'
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verificationToken: {
    type: DataTypes.STRING
  },
  resetPasswordToken: {
    type: DataTypes.STRING
  },
  resetPasswordExpires: {
    type: DataTypes.DATE
  },
  lastLogin: {
    type: DataTypes.DATE
  },
  federationId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Federations',
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.passwordHash) {
        const saltRounds = 12;
        user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('passwordHash')) {
        const saltRounds = 12;
        user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds);
      }
    }
  }
});

// Instance method to check password
User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.passwordHash);
};

// Instance method to generate verification token
User.prototype.generateVerificationToken = function() {
  this.verificationToken = require('crypto').randomBytes(32).toString('hex');
  return this.verificationToken;
};

// Instance method to generate reset token
User.prototype.generatePasswordResetToken = function() {
  this.resetPasswordToken = require('crypto').randomBytes(32).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  return this.resetPasswordToken;
};

module.exports = User;
