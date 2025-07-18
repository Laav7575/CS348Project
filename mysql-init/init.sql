CREATE DATABASE IF NOT EXISTS cs348_project;

USE cs348_project;

DROP TABLE IF EXISTS Adds;
DROP TABLE IF EXISTS Saves;
DROP TABLE IF EXISTS Folders;
DROP TABLE IF EXISTS Reviews;
DROP TABLE IF EXISTS Users;


CREATE TABLE Cars (
  cID                     INT AUTO_INCREMENT not NULL,
  make                    VARCHAR(50) not NULL,
  model                   VARCHAR(50) not NULL,
  image                   VARBINARY(1000),
  year                    INT,
  isElectric              boolean,
  engineSize              float,
  horsePower              float,
  torque                  float,
  acceleration            float,
  price                   float,
  primary key(cID)
);

CREATE TABLE Users (
    uID            INT AUTO_INCREMENT NOT NULL,
    username       VARCHAR(30) UNIQUE,
    email          VARCHAR(100) UNIQUE,
    userPassword   VARCHAR(255),
    isAdmin        BOOLEAN,
    isDeleted      BOOLEAN,
    PRIMARY KEY (uID)
);

CREATE TABLE Reviews (
  uid              INT,
  cid              INT,
  comment              VARCHAR(255) NOT NULL,
  createdDate DATE NOT NULL,
  updatedDate DATE,
  stars INT,
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
  date DATE NOT NULL,
  isLikes BOOLEAN,
  FOREIGN KEY (fID) REFERENCES Folders(fID) ON DELETE CASCADE,
  FOREIGN KEY (cID) REFERENCES Cars(cID) ON DELETE CASCADE
);

CREATE TABLE Adds(
  uID INT NOT NULL,
  cID INT NOT NULL,
  date DATE NOT NULL,
  FOREIGN KEY (uID) REFERENCES Users(uID) ON DELETE CASCADE,
  FOREIGN KEY (cID) REFERENCES Cars(cID) ON DELETE CASCADE
);

-- insert test data
INSERT INTO Cars (make, model, year, isElectric, engineSize, horsePower, torque, acceleration, price) VALUES
('Tesla', 'Model S Plaid', 2023, TRUE, NULL, 1020.0, 1050.0, 1.99, 89990.0),
('Lucid', 'Air Grand Touring', 2023, TRUE, NULL, 819.0, 885.0, 3.0, 125600.0),
('Nissan', 'GT-R Nismo', 2021, FALSE, 3.8, 600.0, 481.0, 2.9, 210740.0),
('Aston Martin', 'DB11', 2022, FALSE, 5.2, 630.0, 516.0, 3.7, 205600.0),
('Jaguar', 'F-Type R', 2021, FALSE, 5.0, 575.0, 516.0, 3.5, 103200.0),
('Dodge', 'Challenger SRT Hellcat', 2022, FALSE, 6.2, 717.0, 656.0, 3.6, 74500.0),
('Koenigsegg', 'Jesko', 2022, FALSE, 5.0, 1600.0, 1106.0, 2.5, 3000000.0),
('Rimac', 'Nevera', 2022, TRUE, NULL, 1914.0, 1741.0, 1.85, 2400000.0),
('Lotus', 'Evora GT', 2021, FALSE, 3.5, 416.0, 317.0, 3.8, 99600.0);

INSERT INTO Users (username, email, userPassword, isAdmin, isDeleted) VALUES
-- 123pass
('angela', 'angela@email.com', '$2b$10$gqlGTqbsm9tlaGHNfLkhFe8lz4BhisclUhflbBIUFIlpmI02x9t3e', TRUE, FALSE),
-- abc123
('gloria', 'gloria@mail.com', '$2b$10$8wcmejw1rcAZ.rZwBKD4ie4iqomEA0Axj/1US/2EWYtAbXLfL5utW', TRUE, FALSE),
-- password
('laavanya', 'laavanya@gmail.com', '$2b$10$CXcRKRYpdRMoKHyyW5u8AuF/VvbSyqHoiN.YOYJjBXmN0pf1H2ZDa', TRUE, FALSE),
-- secret01
('jahnavi', 'jahnavi@example.com', '$2b$10$oEtjC96ZYYkEOD0PYVDyIubEhyUZJ4DDsHpWuqjSP7C06tVoD9G.i', TRUE, FALSE);

INSERT INTO Reviews (uid, cid, comment, createdDate, updatedDate, stars) VALUES
(1, 1, 'Absolutely love the 911 – classic Porsche feel.', '2025-07-03', NULL, 3),
(2, 3, 'The Ferrari 488 is stunning and sounds amazing.', '2025-07-03', NULL, 5),
(3, 5, 'McLaren 720S is super fast. Unreal acceleration!', '2025-07-03', '2025-07-05', 2),
(4, 7, 'Mercedes AMG GT is elegant and powerful.', '2025-07-03', '2025-07-07', 1),
(4, 8, 'GT500 is a beast on the track and the road.', '2025-07-03', NULL, 3);

INSERT INTO Folders (uID, folderName) VALUES
(1, 'AngelaFavorites'),
(2, 'GloriaGarage'),
(3, 'LaavanyaLuxe'),
(4, 'JahnaviCollection');

INSERT INTO Saves (fID, cID, date, isLikes) VALUES
(1, 1, '2025-07-03', FALSE),
(2, 2, '2025-07-03', FALSE),
(3, 3, '2025-07-03', FALSE),
(4, 4, '2025-07-03', FALSE);

INSERT INTO Adds (uID, cID, date) VALUES 
(1, 1, '2025-07-03'),
(1, 2, '2025-07-03'),
(2, 3, '2025-07-03'),
(1, 4, '2025-07-03'),
(1, 5, '2025-07-03'),
(3, 6, '2025-07-03'),
(1, 7, '2025-07-03'),
(3, 8, '2025-07-03'),
(1, 9, '2025-07-03');

CREATE OR REPLACE VIEW carsInFolder AS
SELECT f.fID, c.*
FROM Folders f
JOIN Saves s ON f.fID = s.fID
JOIN Cars c ON s.cID = c.cID;

-- Load data from CSV
-- IMPORTANT: The path '/docker-entrypoint-initdb.d/your_dataset.csv' is relative to the MySQL container's filesystem.
-- Make sure your docker-compose.yml mounts the CSV correctly.
-- LOAD DATA LOCAL INFILE '/docker-entrypoint-initdb.d/cleanedsports.csv'
-- INTO TABLE fullCars
-- FIELDS TERMINATED BY ',' ENCLOSED BY '"'
-- LINES TERMINATED BY '\n'
-- IGNORE 1 ROWS
-- (make, model, year, engineSize, horsePower, torque, acceleration, price);
