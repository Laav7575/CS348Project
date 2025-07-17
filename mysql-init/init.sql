-- init.sql

CREATE DATABASE IF NOT EXISTS cs348_project;

USE cs348_project;

DROP TABLE IF EXISTS Saves;
DROP TABLE IF EXISTS Folders;
DROP TABLE IF EXISTS Reviews;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS testCars;


CREATE TABLE IF NOT EXISTS Cars (
    cID INT AUTO_INCREMENT NOT NULL,
    make VARCHAR(30) NOT NULL,
    model VARCHAR(30) NOT NULL,
    year INT,
    isElectric BOOLEAN,
    engineSize FLOAT,
    horsePower FLOAT,
    torque FLOAT,
    acceleration FLOAT,
    price FLOAT,
    PRIMARY KEY(cID)
);

-- create tables
CREATE TABLE testCars (
   cID                     INT AUTO_INCREMENT not NULL,
   make                    VARCHAR(50) not NULL,
   model                   VARCHAR(50) not NULL,
   image                   VARBINARY(1000),
   year                    INT,
   isElectric		           BOOLEAN,
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
  FOREIGN KEY (fID) REFERENCES Folders(fID) ON DELETE CASCADE,
  FOREIGN KEY (cID) REFERENCES Cars(cID) ON DELETE CASCADE
);

-- insert test data
INSERT INTO testCars (make, model, year, isElectric, engineSize, horsePower, torque, acceleration, price) VALUES
('Porsche', '911', 2022, FALSE, 3.0, 379.0, 331.0, 4.0, 101200.0),
('Lamborghini', 'Huracan', 2021, FALSE, 5.2, 630.0, 443.0, 2.8, 274390.0),
('Ferrari', '488 GTB', 2022, FALSE, 3.9, 661.0, 561.0, 3.0, 333750.0),
('Audi', 'R8', 2022, FALSE, 5.2, 562.0, 406.0, 3.2, 142700.0),
('McLaren', '720S', 2021, FALSE, 4.0, 710.0, 568.0, 2.7, 298000.0),
('BMW', 'M8', 2022, FALSE, 4.4, 617.0, 553.0, 3.1, 130000.0),
('Mercedes-Benz', 'AMG GT', 2021, FALSE, 4.0, 523.0, 494.0, 3.8, 118500.0),
('Chevrolet', 'Corvette', 2021, FALSE, 6.2, 490.0, 465.0, 2.8, 59900.0),
('Ford', 'Mustang Shelby GT500', 2022, FALSE, 5.2, 760.0, 625.0, 3.5, 81000.0);

INSERT INTO Users (username, email, userPassword, isAdmin, isDeleted) VALUES
-- 123pass
('angela', 'angela@email.com', '$2b$10$gqlGTqbsm9tlaGHNfLkhFe8lz4BhisclUhflbBIUFIlpmI02x9t3e', TRUE, FALSE),
-- abc123
('gloria', 'gloria@mail.com', '$2b$10$8wcmejw1rcAZ.rZwBKD4ie4iqomEA0Axj/1US/2EWYtAbXLfL5utW', TRUE, FALSE),
-- password
('laavanya', 'laavanya@gmail.com', '$2b$10$CXcRKRYpdRMoKHyyW5u8AuF/VvbSyqHoiN.YOYJjBXmN0pf1H2ZDa', TRUE, FALSE),
-- secret01
('jahnavi', 'jahnavi@example.com', '$2b$10$oEtjC96ZYYkEOD0PYVDyIubEhyUZJ4DDsHpWuqjSP7C06tVoD9G.i', TRUE, FALSE),
-- atest!
('alexia', 'alexia@example.com', ' $2b$10$uFuf3squWjlB6cF8fldvCeMmSPRNdhH837lXYGZDqkBd5gj0RZmRa', TRUE, FALSE);

INSERT INTO Reviews (uid, cid, comment, createdDate, updatedDate, stars) VALUES
(1, 1, 'Absolutely love the 911 – classic Porsche feel.', '2025-07-03', NULL, 3),
(2, 3, 'The Ferrari 488 is stunning and sounds amazing.', '2025-07-03', NULL, 5),
(3, 5, 'McLaren 720S is super fast. Unreal acceleration!', '2025-07-03', '2025-07-05', 2),
(4, 7, 'Mercedes AMG GT is elegant and powerful.', '2025-07-03', '2025-07-07', 1),
(5, 8, 'GT500 is a beast on the track and the road.', '2025-07-03', NULL, 3);

INSERT INTO Folders (uID, folderName) VALUES
(1, 'AngelaFavorites'),
(2, 'GloriaGarage'),
(3, 'LaavanyaLuxe'),
(4, 'JahnaviCollection'),
(5, 'AlexiaPicks');

INSERT INTO Saves (fID, cID, date) VALUES
(1, 1, '2025-07-03'),
(2, 2, '2025-07-03'),
(3, 3, '2025-07-03'),
(4, 4, '2025-07-03');
