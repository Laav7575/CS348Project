CREATE DATABASE IF NOT EXISTS cs348_project;

USE cs348_project;

-- Create the 'Cars' table if it doesn't already exist
CREATE TABLE IF NOT EXISTS Cars (
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

-- Insert statements for the Cars table
-- cID is AUTO_INCREMENT, so it will be automatically assigned by the database.

INSERT INTO Cars (make, model, year, engineSize, horsePower, torque, acceleration, price)
VALUES ('Porsche', '911', 2022, 3.0, 379.0, 331.0, 4.0, 101200.0);

INSERT INTO Cars (make, model, year, engineSize, horsePower, torque, acceleration, price)
VALUES ('Lamborghini', 'Huracan', 2021, 5.2, 630.0, 443.0, 2.8, 274390.0);

INSERT INTO Cars (make, model, year, engineSize, horsePower, torque, acceleration, price)
VALUES ('Ferrari', '488 GTB', 2022, 3.9, 661.0, 561.0, 3.0, 333750.0);

INSERT INTO Cars (make, model, year, engineSize, horsePower, torque, acceleration, price)
VALUES ('Audi', 'R8', 2022, 5.2, 562.0, 406.0, 3.2, 142700.0);

INSERT INTO Cars (make, model, year, engineSize, horsePower, torque, acceleration, price)
VALUES ('McLaren', '720S', 2021, 4.0, 710.0, 568.0, 2.7, 298000.0);

INSERT INTO Cars (make, model, year, engineSize, horsePower, torque, acceleration, price)
VALUES ('BMW', 'M8', 2022, 4.4, 617.0, 553.0, 3.1, 130000.0);

INSERT INTO Cars (make, model, year, engineSize, horsePower, torque, acceleration, price)
VALUES ('Mercedes-Benz', 'AMG GT', 2021, 4.0, 523.0, 494.0, 3.8, 118500.0);

INSERT INTO Cars (make, model, year, engineSize, horsePower, torque, acceleration, price)
VALUES ('Chevrolet', 'Corvette', 2021, 6.2, 490.0, 465.0, 2.8, 59900.0);

INSERT INTO Cars (make, model, year, engineSize, horsePower, torque, acceleration, price)
VALUES ('Ford', 'Mustang Shelby GT500', 2022, 5.2, 760.0, 625.0, 3.5, 81000.0);

-- CREATE TABLE IF NOT EXISTS users (
--   uid INT AUTO_INCREMENT PRIMARY KEY,
--   name VARCHAR(100)
-- );

-- INSERT INTO users (name) VALUES 
-- ('Angela'), 
-- ('Gloria'), 
-- ('Laavanya'), 
-- ('Jahnavi'), 
-- ('Alexia');
