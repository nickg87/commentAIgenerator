// models/Request.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import { Client } from './Client.js';
import { Site } from './Site.js';

export const Request = sequelize.define('Request', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  clientId: { type: DataTypes.INTEGER, allowNull: false, field: 'client_id' },
  siteId: { type: DataTypes.INTEGER, allowNull: false, field: 'site_id' },
  requestQuery: { type: DataTypes.TEXT, allowNull: false, field: 'request_query' },
  totalTokens: { type: DataTypes.INTEGER, defaultValue: 0, field: 'total_tokens' },
  createdAt: { type: DataTypes.DATE, field: 'created_at' }
}, {
  tableName: 'requests',
  timestamps: false, // no updated_at column in your schema
  underscored: true
});

Client.hasMany(Request, { foreignKey: 'client_id' });
Site.hasMany(Request, { foreignKey: 'site_id' });
Request.belongsTo(Client, { foreignKey: 'client_id' });
Request.belongsTo(Site, { foreignKey: 'site_id' });
