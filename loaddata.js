require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql2/promise');

function parseNumber(val) {
  const num = Number(val);
  return isNaN(num) ? null : num;
}

async function seed() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'cs348_project'
  });

  const csv = fs.readFileSync('cleanedsports.csv', 'utf-8')
    .split('\n')
    .slice(1)
    .filter(line => line.trim() !== '');

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
