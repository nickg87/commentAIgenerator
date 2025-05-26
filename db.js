import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,  // use IPv4 localhost instead of 'localhost'
  dialect: 'mysql',
  dialectOptions: {
    socketPath: process.env.DB_SOCKET_PATH,  // use socket if you want
  },
});

export async function initDb() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');
  } catch (err) {
    console.error('❌ DB error:', err);
    process.exit(1);
  }
}