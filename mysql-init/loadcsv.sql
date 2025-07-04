CREATE DATABASE IF NOT EXISTS cs348_project;
USE cs348_project;

-- Create your table (adjust column names and types as per your CSV)
CREATE TABLE IF NOT EXISTS fullCars (
    cID INT AUTO_INCREMENT NOT NULL,
    make VARCHAR(30) NOT NULL,
    model VARCHAR(30) NOT NULL,
    year INT,
    engineSize FLOAT,
    horsePower FLOAT,
    torque FLOAT,
    acceleration FLOAT,
    price FLOAT,
    PRIMARY KEY(cID)
);

-- Load data from CSV
-- IMPORTANT: The path '/docker-entrypoint-initdb.d/your_dataset.csv' is relative to the MySQL container's filesystem.
-- Make sure your docker-compose.yml mounts the CSV correctly.
LOAD DATA INFILE '/docker-entrypoint-initdb.d/cleanedsports.csv'
INTO TABLE fullCars
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS; -- Since CSV has a header row