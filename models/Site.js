// models/Site.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import { Client } from './Client.js';

export const Site = sequelize.define('Site', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  clientId: { type: DataTypes.INTEGER, allowNull: false, field: 'client_id' },
  url: { type: DataTypes.STRING, allowNull: false },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
  createdAt: { type: DataTypes.DATE, field: 'created_at' },
  updatedAt: { type: DataTypes.DATE, field: 'updated_at' }
}, {
  tableName: 'sites',
  timestamps: true,
  underscored: true
});

Client.hasMany(Site, { foreignKey: 'client_id' });
Site.belongsTo(Client, { foreignKey: 'client_id' });
