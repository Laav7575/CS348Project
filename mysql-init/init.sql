CREATE DATABASE IF NOT EXISTS cs348_project;

USE cs348_project;

DROP TABLE IF EXISTS Saves;
DROP TABLE IF EXISTS Folders;
DROP TABLE IF EXISTS Reviews;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Cars;

-- create tables
CREATE TABLE Cars (
   cID                     INT AUTO_INCREMENT not NULL,
   make                    VARCHAR(50) not NULL,
   model                   VARCHAR(50) not NULL,
   image                   VARBINARY(1000),
   year                    INT,
   isElectric		       boolean,
   engineSize              float,
   horsePower              float,
   torque                  float,
   acceleration            float,
   price                   float,
   primary key(cID)
);


CREATE TABLE Users (
    uID 		INT AUTO_INCREMENT not NULL,
    username 		VARCHAR(30) UNIQUE,
    email 		VARCHAR(100) UNIQUE,
    userPassword 	VARCHAR(255),
    isAdmin	 	bool,
    isDeleted	 	bool,
    primary key(uID)
);

CREATE TABLE Reviews (
   uid 				INT,
   cid 				INT,
   comment 				VARCHAR(255) NOT NULL,
   PRIMARY KEY (uid, cid),
   FOREIGN KEY (uid) REFERENCES Users(uID),
   FOREIGN KEY (cid) REFERENCES Cars(cID) ON DELETE CASCADE
);


CREATE TABLE Folders (
   fID 			INT AUTO_INCREMENT NOT NULL,
   uID 			INT NOT NULL,
   folderName 		VARCHAR(30) NOT NULL UNIQUE,
   PRIMARY KEY(fID),
   FOREIGN KEY(uID) REFERENCES Users(uID) ON DELETE CASCADE
);

CREATE TABLE Saves(
   fID INT NOT NULL,
   cID INT NOT NULL,
   FOREIGN KEY (fID) REFERENCES Folders(fID) ON DELETE CASCADE,
   FOREIGN KEY (cID) REFERENCES Cars(cID) ON DELETE CASCADE
);

-- insert test data
INSERT INTO Cars (make, model, year, isElectric, engineSize, horsePower, torque, acceleration, price)
VALUES ('Porsche', '911', 2022, FALSE, 3.0, 379.0, 331.0, 4.0, 101200.0);

INSERT INTO Cars (make, model, year, isElectric, engineSize, horsePower, torque, acceleration, price)
VALUES ('Lamborghini', 'Huracan', 2021, FALSE, 5.2, 630.0, 443.0, 2.8, 274390.0);

INSERT INTO Cars (make, model, year, isElectric, engineSize, horsePower, torque, acceleration, price)
VALUES ('Ferrari', '488 GTB', 2022, FALSE, 3.9, 661.0, 561.0, 3.0, 333750.0);

INSERT INTO Cars (make, model, year, isElectric, engineSize, horsePower, torque, acceleration, price)
VALUES ('Audi', 'R8', 2022, FALSE, 5.2, 562.0, 406.0, 3.2, 142700.0);

INSERT INTO Cars (make, model, year, isElectric, engineSize, horsePower, torque, acceleration, price)
VALUES ('McLaren', '720S', 2021, FALSE, 4.0, 710.0, 568.0, 2.7, 298000.0);

INSERT INTO Cars (make, model, year, isElectric, engineSize, horsePower, torque, acceleration, price)
VALUES ('BMW', 'M8', 2022, FALSE, 4.4, 617.0, 553.0, 3.1, 130000.0);

INSERT INTO Cars (make, model, year, isElectric, engineSize, horsePower, torque, acceleration, price)
VALUES ('Mercedes-Benz', 'AMG GT', 2021, FALSE, 4.0, 523.0, 494.0, 3.8, 118500.0);

INSERT INTO Cars (make, model, year, isElectric, engineSize, horsePower, torque, acceleration, price)
VALUES ('Chevrolet', 'Corvette', 2021, FALSE, 6.2, 490.0, 465.0, 2.8, 59900.0);

INSERT INTO Cars (make, model, year, isElectric, engineSize, horsePower, torque, acceleration, price)
VALUES ('Ford', 'Mustang Shelby GT500', 2022, FALSE, 5.2, 760.0, 625.0, 3.5, 81000.0);

INSERT INTO Users (username, email, userPassword, isAdmin, isDeleted) VALUES
('angela', 'angela@example.com', 'passAngela!', TRUE, FALSE),
('gloria', 'gloria@example.com', 'gloriaPass1', TRUE, FALSE),
('laavanya', 'laavanya@example.com', 'laavPass2', TRUE, FALSE),
('jahnavi', 'jahnavi@example.com', 'jahnaviPass', TRUE, FALSE),
('alexia', 'alexia@example.com', 'alexia123', TRUE, FALSE);

INSERT INTO Reviews (uid, cid, comment) VALUES
(1, 1, 'Absolutely love the 911 – classic Porsche feel.'),
(2, 3, 'The Ferrari 488 is stunning and sounds amazing.'),
(3, 5, 'McLaren 720S is super fast. Unreal acceleration!'),
(4, 7, 'Mercedes AMG GT is elegant and powerful.'),
(5, 9, 'GT500 is a beast on the track and the road.');

INSERT INTO Folders (uID, folderName) VALUES
(1, 'AngelaFavorites'),
(2, 'GloriaGarage'),
(3, 'LaavanyaLuxe'),
(4, 'JahnaviCollection'),
(5, 'AlexiaPicks');

INSERT INTO Saves (fID, cID) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4);

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
-- LOAD DATA LOCAL INFILE '/docker-entrypoint-initdb.d/cleanedsports.csv'
-- INTO TABLE fullCars
-- FIELDS TERMINATED BY ',' ENCLOSED BY '"'
-- LINES TERMINATED BY '\n'
-- IGNORE 1 ROWS
-- (make, model, year, engineSize, horsePower, torque, acceleration, price);
