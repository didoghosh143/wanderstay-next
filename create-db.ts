import mysql from 'mysql2/promise';

async function createDb() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '*Didonft123#'
  });
  
  await connection.query('CREATE DATABASE IF NOT EXISTS wanderstay');
  console.log('Database wanderstay created or already exists');
  await connection.end();
}

createDb().catch(console.error);
