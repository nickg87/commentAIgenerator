import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

let sequelize;

if (process.env.IS_LIVE_SERVER === 'true') {
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST, // live host, e.g. 'localhost'
    dialect: 'mysql',
    logging: false,
  });
} else {
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: 'mysql',
    dialectOptions: {
      socketPath: process.env.DB_SOCKET_PATH, // local socket path
    },
    logging: false,
  });
}

export { sequelize };

export async function initDb() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');
  } catch (err) {
    console.error('❌ DB error:', err.message);
    process.exit(1);
  }
}
