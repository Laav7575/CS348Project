-- init.sql

CREATE DATABASE IF NOT EXISTS cs348_project;

USE cs348_project;

DROP TABLE IF EXISTS Adds;
DROP TABLE IF EXISTS Saves;
DROP TABLE IF EXISTS Folders;
DROP TABLE IF EXISTS Reviews;
DROP TABLE IF EXISTS Users;


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

CREATE INDEX idx_cars_price ON testCars(price);
CREATE INDEX idx_cars_year ON testCars(year);

CREATE TABLE Users (
    uID            INT AUTO_INCREMENT NOT NULL,
    username       VARCHAR(30) UNIQUE,
    email          VARCHAR(100) UNIQUE,
    userPassword   VARCHAR(255),
    isAdmin        BOOLEAN,
    isDeleted      BOOLEAN,
    PRIMARY KEY (uID),
    -- CHECK (username REGEXP '^[A-Za-z0-9_-]+$.'),
    CHECK (regexp_like(`username`, _latin1'^[A-Za-z0-9_.-]+$')), 
    CHECK (email LIKE '%@%')
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
  FOREIGN KEY (cid) REFERENCES testCars(cID) ON DELETE CASCADE
);

CREATE INDEX idx_uid_cid ON Reviews(uid, cid);

CREATE TABLE Folders (
   fID 			INT AUTO_INCREMENT NOT NULL,
   uID 			INT NOT NULL,
   folderName 		VARCHAR(30) NOT NULL,
   isLikes BOOLEAN DEFAULT FALSE,
   PRIMARY KEY(fID),
   FOREIGN KEY(uID) REFERENCES Users(uID) ON DELETE CASCADE
);

CREATE TABLE Saves(
  fID INT NOT NULL,
  cID INT NOT NULL,
  date DATE NOT NULL,
  FOREIGN KEY (fID) REFERENCES Folders(fID) ON DELETE CASCADE,
  FOREIGN KEY (cID) REFERENCES testCars(cID) ON DELETE CASCADE
);

CREATE INDEX idx_saves_date_cid ON Saves(date, cID); 

CREATE TABLE Adds(
  uID INT NOT NULL,
  cID INT NOT NULL,
  date DATE NOT NULL,
  FOREIGN KEY (uID) REFERENCES Users(uID) ON DELETE CASCADE,
  FOREIGN KEY (cID) REFERENCES testCars(cID) ON DELETE CASCADE
);

DELIMITER //

DROP TRIGGER IF EXISTS create_likes_folder_after_user_insert//

CREATE TRIGGER create_likes_folder_after_user_insert
AFTER INSERT ON Users
FOR EACH ROW
BEGIN
  INSERT INTO Folders (uID, folderName, isLikes)
  VALUES (NEW.uID, 'Likes', TRUE);
END//

DELIMITER ;

-- insert test data
INSERT INTO testCars (make, model, year, isElectric, engineSize, horsePower, torque, acceleration, price) VALUES
('Tesla', 'Model S Plaid', 2023, TRUE, NULL, 1020.0, 1050.0, 1.99, 89990.0),
('Lucid', 'Air Grand Touring', 2023, TRUE, NULL, 819.0, 885.0, 3.0, 125600.0),
('Nissan', 'GT-R Nismo', 2021, FALSE, 3.8, 600.0, 481.0, 2.9, 210740.0),
('Aston Martin', 'DB11', 2022, FALSE, 5.2, 630.0, 516.0, 3.7, 205600.0),
('Jaguar', 'F-Type R', 2021, FALSE, 5.0, 575.0, 516.0, 3.5, 103200.0),
('Dodge', 'Challenger SRT Hellcat', 2022, FALSE, 6.2, 717.0, 656.0, 3.6, 74500.0),
('Koenigsegg', 'Jesko', 2022, FALSE, 5.0, 1600.0, 1106.0, 2.5, 3000000.0),
('Rimac', 'Nevera', 2022, TRUE, NULL, 1914.0, 1741.0, 1.85, 2400000.0),
('Lotus', 'Evora GT', 2021, FALSE, 3.5, 416.0, 317.0, 3.8, 99600.0);

-- user admins
INSERT INTO Users (username, email, userPassword, isAdmin, isDeleted) VALUES
-- 123pass
('angela', 'angela@email.com', '$2b$10$gqlGTqbsm9tlaGHNfLkhFe8lz4BhisclUhflbBIUFIlpmI02x9t3e', TRUE, FALSE),
-- abc123
('gloria', 'gloria@mail.com', '$2b$10$8wcmejw1rcAZ.rZwBKD4ie4iqomEA0Axj/1US/2EWYtAbXLfL5utW', TRUE, FALSE),
-- password
('laavanya', 'laavanya@gmail.com', '$2b$10$CXcRKRYpdRMoKHyyW5u8AuF/VvbSyqHoiN.YOYJjBXmN0pf1H2ZDa', FALSE, FALSE),
-- secret01
('jahnavi', 'jahnavi@example.com', '$2b$10$oEtjC96ZYYkEOD0PYVDyIubEhyUZJ4DDsHpWuqjSP7C06tVoD9G.i', FALSE, FALSE);

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

INSERT INTO Saves (fID, cID, date) VALUES
(1, 1, '2025-07-22'),
(2, 2, '2025-07-22'),
(3, 3, '2025-07-22'),
(4, 4, '2025-07-22');

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
SELECT DISTINCT f.uID, f.fID, c.*
FROM Folders f
JOIN Saves s ON f.fID = s.fID
JOIN testCars c ON s.cID = c.cID;

CREATE OR REPLACE VIEW likesFolder AS
SELECT DISTINCT f.uID, f.fID, c.*
FROM Folders f
JOIN Saves s ON f.fID = s.fID
JOIN testCars c ON s.cID = c.cID
WHERE isLikes = TRUE;

-- View to summarize a user's preferences based on their liked cars.
-- Calculates average, min, and max values to determine flexible preference ranges.
CREATE OR REPLACE VIEW user_preferences_view AS
SELECT
    uID,
    GROUP_CONCAT(DISTINCT make) AS liked_makes,
    AVG(price) AS avg_price,
    MIN(price) * 0.7 AS min_price_range,
    MAX(price) * 1.3 AS max_price_range,
    AVG(year) AS avg_year,
    MIN(year) - 5 AS min_year_range,
    MAX(year) + 5 AS max_year_range
FROM likesFolder
GROUP BY uID;

-- View to score out of 100 and recommend cars to users based on how well each car matches their preferences.
-- Excludes any cars the user has already liked.
-- Using a linear proximity score for year and price
CREATE OR REPLACE VIEW car_recommendations_view AS
SELECT c.cID, c.make, c.model, c.year, c.price, up.uID,
    -- Score 55 if the car's make matches a liked make, otherwise 0
    CASE
        WHEN FIND_IN_SET(c.make, up.liked_makes) > 0 THEN 50
        ELSE 0
    END AS make_score,
    
    -- Price score: 28 points max
    -- Price score is higher if the car's price is close to the user's average liked price
    CASE
        WHEN c.price BETWEEN up.min_price_range AND up.max_price_range THEN
            35 * (1 - ABS(c.price - up.avg_price) / GREATEST(up.avg_price, 1))
        ELSE 0
    END AS price_score,
    
    -- Year score: 17 points max
    -- Year score is higher if the car's year is close to the user's average liked year
    CASE
        WHEN c.year BETWEEN up.min_year_range AND up.max_year_range THEN
            15 * (1 - ABS(c.year - up.avg_year) / GREATEST(up.avg_year - 1900, 1))
        ELSE 0
    END AS year_score
FROM testCars c
JOIN user_preferences_view up ON 1=1 -- Cross join: apply every user's preferences to all cars
-- Exclude cars the user has already liked
WHERE NOT EXISTS (
    SELECT 1
    FROM likesFolder ulcv
    WHERE ulcv.uID = up.uID AND ulcv.cID = c.cID
);

-- Final view that combines all recommendation scores and filters out zero-score cars.
-- The higher the recommendation_score, the better the match.
CREATE OR REPLACE VIEW final_recommendations_view AS
SELECT *,
    ROUND(make_score + price_score + year_score, 2) AS recommendation_score
FROM car_recommendations_view
WHERE (make_score + price_score + year_score) > 0;