require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql2/promise');

function parseNumber(val) {
  const num = Number(val);
  return isNaN(num) ? null : num;
}

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3307,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'cs348_project'
  });

  console.log(`Connecting to MySQL at ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3307}`);

  const csv = fs.readFileSync('cleanedsports.csv', 'utf-8')
    .split('\n')
    .slice(1)
    .filter(line => line.trim() !== '');

  console.log(`Processing ${csv.length} rows from CSV...`);

  for (const row of csv) {
    const [make, model, year, engineSize, horsePower, torque, acceleration, price] = row.split(',');

    await connection.execute(
      'INSERT INTO fullCars (make, model, year, engineSize, horsePower, torque, acceleration, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        make,
        model,
        parseNumber(year),
        parseNumber(engineSize),
        parseNumber(horsePower),
        parseNumber(torque),
        parseNumber(acceleration),
        parseNumber(price.replace(/"/g, '').replace(/,/g, ''))
      ]
    );
  }

  console.log('Done!');
  await connection.end();
}

seed().catch(console.error);