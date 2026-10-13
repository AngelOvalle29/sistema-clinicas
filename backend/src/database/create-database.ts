import 'dotenv/config';
import { createConnection } from 'mysql2/promise';

async function createDatabase() {
  const connection = await createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });

  const database = process.env.DB_DATABASE;
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  await connection.end();

  console.log(`Base de datos "${database}" lista.`);
}

createDatabase().catch((error) => {
  console.error('No se pudo crear la base de datos:', error);
  process.exit(1);
});
