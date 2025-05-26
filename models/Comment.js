// models/Comment.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import { Request } from './Request.js';

export const Comment = sequelize.define('Comment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  requestId: { type: DataTypes.INTEGER, allowNull: false, field: 'request_id' },
  comment: { type: DataTypes.TEXT, allowNull: false },
  createdAt: { type: DataTypes.DATE, field: 'created_at' }
}, {
  tableName: 'comments',
  timestamps: false,
  underscored: true
});

Request.hasMany(Comment, { foreignKey: 'request_id' });
Comment.belongsTo(Request, { foreignKey: 'request_id' });
