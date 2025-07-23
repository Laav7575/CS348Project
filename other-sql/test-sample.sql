-- This files used the data in init-sample.sql

SELECT * 
FROM testCars
WHERE year = 2022;

SELECT * 
FROM testCars 
WHERE make LIKE '%GT%' OR model LIKE '%GT%';

INSERT INTO Users (username, email, userPassword, isAdmin, isDeleted) VALUES
('alexia', 'alexia@example.com', ' $2b$10$uFuf3squWjlB6cF8fldvCeMmSPRNdhH837lXYGZDqkBd5gj0RZmRa', TRUE, FALSE);

DELETE FROM Saves
WHERE cID = 2 AND fID = 2
AND fID IN (SELECT fID FROM Folders WHERE uID = 2);

SELECT DISTINCT f.fID, c.cID, c.make, c.model, c.year
FROM Folders f
JOIN Saves s ON f.fID = s.fID
JOIN testCars c ON c.cID = s.cID
WHERE f.uID = 3;

UPDATE Reviews
SET comment = "Nice Car", stars = 4, updatedDate = '2025-07-03'
WHERE uid = 1 AND cID = 1;

SELECT s.cID, c.make, c.model, c.price, c.year, COUNT(*) AS saveCount
       FROM Saves s
       JOIN testCars c ON s.cID = c.cID
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

SELECT * FROM carsInFolder 
WHERE fid = 1 AND uid = 1 
ORDER BY year DESC;

SELECT DISTINCT * FROM likesFolder 
WHERE uid = 1 
ORDER BY year DESC;

SELECT 
    COUNT(*) AS folderSize, 
    ROUND(AVG(price)) AS avgPrice,  
    (
    SELECT make FROM carsInFolder
    WHERE fID = 1 AND uID = 1
    GROUP BY make
    ORDER BY COUNT(*) DESC
    LIMIT 1
    ) AS commonMake,
    (
    SELECT model FROM carsInFolder
    WHERE fID = 1AND uID = 1
    GROUP BY model
    ORDER BY COUNT(*) DESC
    LIMIT 1
    ) AS commonModel,
    ROUND(AVG(year)) AS avgYear,
    SUM(CASE WHEN isElectric THEN 1 ELSE 0 END) AS electricCount,
    ROUND(AVG(engineSize), 2) AS avgEngineSize,
    ROUND(AVG(horsePower)) AS avgHorsePower,
    ROUND(AVG(torque)) AS avgTorque,
    ROUND(AVG(acceleration), 2) AS avgAcceleration
FROM carsInFolder
WHERE fID = 1 AND uID = 1;

SELECT cID, make, model, year, price, recommendation_score, make_score, price_score, year_score
FROM final_recommendations_view
WHERE uID = 1
ORDER BY price_score DESC
LIMIT 25;

START TRANSACTION;
DELETE FROM testCars WHERE cID IN (1, 2);
COMMIT;

