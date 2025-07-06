SELECT * 
FROM Cars
WHERE year = 2022
LIMIT 10;

SELECT * 
FROM Cars 
WHERE make LIKE '%GT%' OR model LIKE '%GT%'
LIMIT 10;

INSERT INTO Users (username, email, userPassword, isAdmin, isDeleted) 
VALUES ('fred', 'fred@example.com', 'fred123', FALSE, FALSE);

DELETE FROM Saves
WHERE cID = 2 AND fID = 2;

SELECT Cars.*, Folders.folderName
FROM Saves
JOIN Folders ON Saves.fID = Folders.fID
JOIN Users ON Folders.uID = Users.uID
JOIN Cars ON Saves.cID = Cars.cID
WHERE Users.uID = 3
LIMIT 10;

UPDATE Reviews
SET comment = "Nice Car", stars = 4, updatedDate = '2025-07-03'
WHERE uid = 1 AND cID = 1;
