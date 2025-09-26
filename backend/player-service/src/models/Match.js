import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Match = sequelize.define('Match', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  matchDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
  },
  opponent: {
    type: DataTypes.STRING,
  },
  result: {
    type: DataTypes.STRING,
  },
  videoUrl: {
    type: DataTypes.STRING,
  },
  federationId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  tableName: 'matches',
  timestamps: true,
});

export default Match;
