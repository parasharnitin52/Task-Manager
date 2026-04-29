import { app } from './app.js';
import './models/index.js';
import { env } from './config/env.js';
import { sequelize } from './config/db.js';
import { permissionRepository } from './repositories/permission.repository.js';

await sequelize.authenticate();

if (env.dbSync) {
  await sequelize.sync({ alter: env.nodeEnv === 'development' });
}

await permissionRepository.ensureDefaults();

const server = app.listen(env.port, () => {
  console.log(`API running on http://localhost:${env.port}`);
});

const shutdown = async () => {
  server.close(async () => {
    await sequelize.close();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
