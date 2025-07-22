SELECT * 
FROM Cars
WHERE year = 2022;

SELECT * 
FROM Cars 
WHERE make LIKE '%GT%' OR model LIKE '%GT%';

INSERT INTO Users (username, email, userPassword, isAdmin, isDeleted) VALUES
('alexia', 'alexia@example.com', ' $2b$10$uFuf3squWjlB6cF8fldvCeMmSPRNdhH837lXYGZDqkBd5gj0RZmRa', TRUE, FALSE);

DELETE FROM Saves
WHERE cID = 2 AND fID = 2
AND fID IN (SELECT fID FROM Folders WHERE uID = 2);

SELECT DISTINCT f.fID, c.cID, c.make, c.model, c.year
FROM Folders f
JOIN Saves s ON f.fID = s.fID
JOIN Cars c ON c.cID = s.cID
WHERE f.uID = 3;

UPDATE Reviews
SET comment = "Nice Car", stars = 4, updatedDate = '2025-07-03'
WHERE uid = 1 AND cID = 1;

SELECT s.cID, c.make, c.model, c.price, c.year, COUNT(*) AS saveCount
       FROM Saves s
       JOIN Cars c ON s.cID = c.cID
       WHERE s.date >= CURDATE() - INTERVAL 7 DAY
       GROUP BY s.cID
       ORDER BY saveCount DESC
       LIMIT 10;

SELECT s.cID
        FROM Saves s
        WHERE s.date >= CURDATE() - INTERVAL 7 DAY
        GROUP BY s.cID
        ORDER BY COUNT(*) DESC
        LIMIT 1;

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


