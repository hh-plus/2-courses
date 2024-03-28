import { exec } from 'child_process';
import { promisify } from 'util';
import { PostgreSqlContainer } from '@testcontainers/postgresql';

const execAsync = promisify(exec);

import { PrismaService } from '@/prisma/prisma.service';

async function setupTestContainer() {
  const container = await new PostgreSqlContainer().start();

  const connectionConfig = {
    host: container.getHost(),
    port: container.getMappedPort(5432),
    database: container.getDatabase(),
    user: container.getUsername(),
    password: container.getPassword(),
  };

  return { container, connectionConfig };
}

export async function setupPrismaService() {
  const { container, connectionConfig } = await setupTestContainer();
  const databaseUrl = `postgresql://${connectionConfig.user}:${connectionConfig.password}@${connectionConfig.host}:${connectionConfig.port}/${connectionConfig.database}`;

  await execAsync(
    `DATABASE_URL=${databaseUrl} npx prisma migrate deploy --preview-feature`,
  );

  const prisma = new PrismaService({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

  return { container, prisma };
}
