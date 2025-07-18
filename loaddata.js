// loaddata.js
require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql2/promise');

function parseNumber(val) {
  const num = Number(val);
  return isNaN(num) ? null : num;
}

// New helper function to parse boolean strings
function parseBoolean(val) {
  return val.toLowerCase() === 'true' ? 1 : 0;
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
    let [make, model, year, isElectric, engineSize, horsePower, torque, acceleration, price] = row.split(',');

    // Convert isElectric string ('True'/'False') to 1 or 0
    const electricValue = parseBoolean(isElectric);

    await connection.execute(
      'INSERT INTO Cars (make, model, year, isElectric, engineSize, horsePower, torque, acceleration, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        make,
        model,
        parseNumber(year),
        electricValue, // Use the converted numerical value here
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