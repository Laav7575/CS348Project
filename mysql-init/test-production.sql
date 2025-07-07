SELECT * 
FROM Cars
WHERE year = 2022
LIMIT 10;

SELECT * 
FROM Cars 
WHERE make LIKE '%GT%' OR model LIKE '%GT%'
LIMIT 10;

INSERT INTO Users (username, email, userPassword, isAdmin, isDeleted) VALUES
('alexia', 'alexia@example.com', ' $2b$10$uFuf3squWjlB6cF8fldvCeMmSPRNdhH837lXYGZDqkBd5gj0RZmRa', TRUE, FALSE);

DELETE FROM Saves
WHERE cID = 2 AND fID = 2;

SELECT f.fID, c.cID, c.make, c.model, c.year
FROM Folders f
JOIN Saves s ON f.fID = s.fID
JOIN Cars c ON c.cID = s.cID
WHERE f.uID = 3
LIMIT 10;

UPDATE Reviews
SET comment = "Nice Car", stars = 4, updatedDate = '2025-07-03'
WHERE uid = 1 AND cID = 1;
