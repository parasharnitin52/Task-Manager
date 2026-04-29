import { Sequelize } from 'sequelize';
import { env } from './env.js';

const sequelizeOptions = {
  dialect: 'postgres',
  logging: false,
  define: {
    underscored: true,
    timestamps: true
  },
  dialectOptions: env.databaseUrl || env.nodeEnv === 'production' ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {}
};

export const sequelize = env.databaseUrl
  ? new Sequelize(env.databaseUrl, sequelizeOptions)
  : new Sequelize(env.dbName, env.dbUser, env.dbPassword, {
    ...sequelizeOptions,
    host: env.dbHost,
    port: env.dbPort
  });
