CREATE DATABASE IF NOT EXISTS cs348_project;

USE cs348_project;

DROP TABLE IF EXISTS Reviews;
DROP TABLE IF EXISTS Folders;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Cars;
DROP TABLE IF EXISTS Saves;

-- create tables
CREATE TABLE Cars (
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

create table Users (
    uID INT AUTO_INCREMENT NOT NULL,
    username VARCHAR(30),
    email VARCHAR(30) UNIQUE,
    userPassword VARCHAR(30),
    primary key(uID)
);

CREATE TABLE Reviews (
    uid INT,
    cid INT,
    comment VARCHAR(255) NOT NULL,
    PRIMARY KEY (uid, cid),
    FOREIGN KEY (uid) REFERENCES Users(uID),
    FOREIGN KEY (cid) REFERENCES Cars(cID)
);

CREATE TABLE Folders (
    fID INT AUTO_INCREMENT NOT NULL,
    uID INT NOT NULL,
    folderName VARCHAR(30) NOT NULL UNIQUE,
    PRIMARY KEY(fID),
    FOREIGN KEY (uID) REFERENCES Users(uID) ON DELETE CASCADE
);

CREATE TABLE Saves(
    fID INT NOT NULL,
    cID INT NOT NULL,
    FOREIGN KEY (fID) REFERENCES Folders(fID),
    FOREIGN KEY (cID) REFERENCES Cars(cID)
);

-- insert test data
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

INSERT INTO Users (username, email, userPassword) VALUES
('angela', 'angela@example.com', 'passAngela!'),
('gloria', 'gloria@example.com', 'gloriaPass1'),
('laavanya', 'laavanya@example.com', 'laavPass2'),
('jahnavi', 'jahnavi@example.com', 'jahnaviPass'),
('alexia', 'alexia@example.com', 'alexia123');

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
