// IGNORE

// backend/server.js
const express = require('express');
const mysql = require('mysql2/promise'); // Using promise-based API for async/await
const multer = require('multer');
const cors = require('cors');
const csv = require('csv-parser'); // Or any other CSV parsing library
const { Readable } = require('stream');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for React frontend
app.use(express.json()); // For parsing application/json

// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Store file in memory as a Buffer
const upload = multer({ storage: storage });

// MySQL connection pool
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost', // 'db' is the service name from docker-compose
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'ELHDD.J!w9bdNnL-',
    database: process.env.MYSQL_DATABASE || 'cs348_project',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test DB connection
app.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS solution');
        res.send(`Database connected! Solution: ${rows[0].solution}`);
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).send('Database connection failed.');
    }
});

// CSV Upload Endpoint
app.post('/upload-csv', upload.single('csvFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const buffer = req.file.buffer;
    const csvStream = Readable.from(buffer.toString()); // Convert buffer to readable stream

    let results = [];
    try {
        // Parse CSV data
        // csv-parser by default uses the first row as headers.
        // It will return an object for each row where keys are the headers.
        await new Promise((resolve, reject) => {
            csvStream
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', resolve)
                .on('error', reject);
        });

        if (results.length === 0) {
            return res.status(400).send('CSV file is empty or could not be parsed.');
        }

        const connection = await pool.getConnection();
        await connection.beginTransaction(); // Start a transaction for atomicity

        try {
            // Define the columns for your Cars table (excluding cID as it's AUTO_INCREMENT)
            const tableColumns = [
                'make', 'model', 'year', 'engineSize',
                'horsePower', 'torque', 'acceleration', 'price'
            ];
            const placeholders = tableColumns.map(() => '?').join(', '); // Creates '?, ?, ?, ...'

            const insertQuery = `INSERT INTO Cars (${tableColumns.join(', ')}) VALUES (${placeholders})`;

            // Prepare data for batch insert
            // Ensure the order of values matches the order of tableColumns
            const values = results.map(row => [
                row.make, // Assuming CSV has a 'make' column
                row.model, // Assuming CSV has a 'model' column
                row.year ? parseInt(row.year) : null, // Convert to integer, handle potential null
                row.engineSize ? parseFloat(row.engineSize) : null, // Convert to float
                row.horsePower ? parseFloat(row.horsePower) : null, // Convert to float
                row.torque ? parseFloat(row.torque) : null, // Convert to float
                row.acceleration ? parseFloat(row.acceleration) : null, // Convert to float
                row.price ? parseFloat(row.price) : null // Convert to float
            ]);

            // Execute the batch insert
            // The `query` method for mysql2/promise supports batch insertion by passing an array of arrays for values
            await connection.query(insertQuery, [values]);
            await connection.commit();
            connection.release();

            res.status(200).send(`CSV data imported successfully! ${results.length} rows inserted into Cars table.`);

        } catch (dbErr) {
            await connection.rollback(); // Rollback on error
            connection.release();
            console.error('Database insertion error:', dbErr);
            res.status(500).send('Error importing data to database: ' + dbErr.message);
        }

    } catch (csvErr) {
        console.error('CSV parsing error:', csvErr);
        res.status(500).send('Error parsing CSV file: ' + csvErr.message);
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
