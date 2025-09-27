import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Federation = sequelize.define('Federation', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
    region: {
        type: DataTypes.STRING,
        allowNull: false
    },
    adminEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    contactPhone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    verifiedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'federations',
    timestamps: true
});

// Sync model with database
Federation.sync({ alter: true })
    .then(() => console.log('✅ Federation model synchronized with database'))
    .catch(error => console.error('❌ Error syncing Federation model:', error));
