SELECT * 
FROM Cars
WHERE year = 2022;

INSERT INTO Saves (fID, cID, date) VALUES (5, 8, '2025-07-03');

DELETE FROM Saves
WHERE cID = 2 AND fID = 2;

SELECT * 
FROM Cars 
WHERE make LIKE '%GT%' OR model LIKE '%GT%';

INSERT INTO Folders(uID, folderName) VALUES (3, 'LaavLoves');

SELECT Cars.*, Folders.folderName
FROM Saves
JOIN Folders ON Saves.fID = Folders.fID
JOIN Users ON Folders.uID = Users.uID
JOIN Cars ON Saves.cID = Cars.cID
WHERE Users.uID = 3;

UPDATE Reviews
SET comment = "Nice Car", stars = 4, updatedDate = '2025-07-03'
WHERE uid = 1 AND cID = 1;
