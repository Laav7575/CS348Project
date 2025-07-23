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
  const pool =  mysql.createPool({
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

  const BATCH_SIZE = 50;

  for (let i = 0; i < csv.length; i += BATCH_SIZE) {
     const batch = csv.slice(i, i + BATCH_SIZE);
  const promises = batch.map(row => {
    let [make, model, year, isElectric, engineSize, horsePower, torque, acceleration, price] = row.split(',');

    const electricValue = parseBoolean(isElectric);
  
    return pool.execute(
      'INSERT INTO Cars (make, model, year, isElectric, engineSize, horsePower, torque, acceleration, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        make,
        model,
        parseNumber(year),
        electricValue,
        parseNumber(engineSize),
        parseNumber(horsePower),
        parseNumber(torque),
        parseNumber(acceleration),
        parseNumber(price.replace(/"/g, '').replace(/,/g, ''))
      ]
    );
  });

  await Promise.all(promises);
  console.log(`Inserted batch ${i / BATCH_SIZE + 1}`);
}
console.log("Done!");
}
seed().catch(console.error);