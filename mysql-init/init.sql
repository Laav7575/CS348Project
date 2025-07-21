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


CREATE TABLE Users (
    uID            INT AUTO_INCREMENT NOT NULL,
    username       VARCHAR(30) UNIQUE,
    email          VARCHAR(100) UNIQUE,
    userPassword   VARCHAR(255),
    isAdmin        BOOLEAN,
    isDeleted      BOOLEAN,
    PRIMARY KEY (uID),
    CHECK (username REGEXP '^[A-Za-z0-9_-]+$'),
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
  FOREIGN KEY (cid) REFERENCES Cars(cID) ON DELETE CASCADE
);

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
  FOREIGN KEY (cID) REFERENCES Cars(cID) ON DELETE CASCADE
);

CREATE TABLE Adds(
  uID INT NOT NULL,
  cID INT NOT NULL,
  date DATE NOT NULL,
  FOREIGN KEY (uID) REFERENCES Users(uID) ON DELETE CASCADE,
  FOREIGN KEY (cID) REFERENCES Cars(cID) ON DELETE CASCADE
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
(1, 1, '2025-07-03'),
(2, 2, '2025-07-03'),
(3, 3, '2025-07-03'),
(4, 4, '2025-07-03');

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
JOIN Cars c ON s.cID = c.cID;

CREATE OR REPLACE VIEW likesFolder AS
SELECT DISTINCT f.uID, f.fID, c.*
FROM Folders f
JOIN Saves s ON f.fID = s.fID
JOIN Cars c ON s.cID = c.cID
WHERE isLikes = TRUE;

INSERT INTO Users (username, email, password, isAdmin, isDeleted) VALUES
-- password: XGbB_MHktBspFnF
 ('herminia.gibson10', 'jerald68@yahoo.com', '$2b$10$VLxhawoB7TjHgoR/UU8.p.RHH2Sn2FHX17fDACC5tZjvxs81.uHUW', false, false),
-- password: QWQOeNNQmQjPMv5
 ('jamison_shanahan27', 'hilda.beatty96@yahoo.com', '$2b$10$bumRNSXrrs1AjBcSxk5vbe/8Yv5dCZKMx0PMN.5DaEd5v4/WsDn9u', false, false),
-- password: 4j6LpVUuWEVLd88
 ('nils19', 'henderson49@gmail.com', '$2b$10$bGWBAQN/KTHZS6JRJTfldeJ5X9aMmFa9RmaozWT8kBxqgHbBDaD0y', false, false),
-- password: BqcX_l7GzIEDFI3
 ('oren.kunze49', 'thurman74@hotmail.com', '$2b$10$7Mmak9hy.4lBeM/lJawpzu0JScsWWKHfzyBe3LFIdq2ND7aYQBnNu', false, false),
-- password: KouvuWtwi4UHatb
 ('monserrat_blanda3', 'meagan.kunde@yahoo.com', '$2b$10$qbTmV1Z5xqFdhXohzIe5euPF6TvMhuKqvHIWzPV3vx/SHJS06wSxi', false, false),
-- password: ouulipMGrVJl6GW
 ('harold.jaskolski-dubuque', 'mario10@yahoo.com', '$2b$10$eJYpmfr4abH53PEl1XG8NOOC1p44n8038cHDhWg.laCerVRCclqKq', false, false),
-- password: boj3xpqgt_eFGnt
 ('stella51', 'christophe.franecki@yahoo.com', '$2b$10$CXfsOGNi9GxcXPcB2TfPwevW0VwOtbFFl9cywtW8GPovUMooeEvVC', false, false),
-- password: uf6cXFe52dUsfzB
 ('korey.roob', 'emilie38@yahoo.com', '$2b$10$OqpxYyr4BMyf/gjHr3Ab8.SSri0WFc8zwg/hR9lmML5psUUDXgKRC', false, false),
-- password: T44brXBuECwZw7L
 ('gianni_pollich20', 'paula_daugherty61@gmail.com', '$2b$10$KZnXi/UXLZC1tQQ38jm3quodgKuw6VtMQePkR7gcAA8TNWprZ5v0q', false, false),
-- password: 8orsLrRSSQg29r6
 ('norris_pfannerstill', 'julian72@gmail.com', '$2b$10$UM98b6DsdSbcJtRyHZipgOEMYZBVzt6El1sMr98vI.9EaZrn7j3Ie', false, false),
-- password: b5ezr2DA8CR2s8F
 ('armani88', 'clifford.ritchie24@yahoo.com', '$2b$10$ACg94gnHbJ08OtpktyjlG.ukg6xUD3aaeW1axdSmAHyGl799JnbjK', false, false),
-- password: yvExDwBn41sgEg7
 ('august85', 'zane_feest59@yahoo.com', '$2b$10$ngpDb65nYsmZT9TKJxyj6uR1HFGQAqYEBLsHe5/9vHgrD8XTmrY8O', false, false),
-- password: Us1_dnU2E_Bz8bq
 ('eloise_leffler93', 'mae28@gmail.com', '$2b$10$WCxkeKIddJjY0RYHyPV9v.8mQQxYPzUpqNAbnmCLhUvzkBLG5lrYa', false, false),
-- password: ZDmRJ2Ag8bZhEYO
 ('nicole.durgan', 'adriana.schaefer@gmail.com', '$2b$10$Z4xJNpR9p4.FSVg/pAdS7egrOYa5IeI/z0oI67jLCDXIBqrmv6MLu', false, false),
-- password: LhiLJpy0GCkR8Xf
 ('alec_torp65', 'cullen.prohaska@hotmail.com', '$2b$10$/HYDPPzIdBmU2ABBgD2oo.1GOrxQDvbcncmbDlxTNkGEtGCiyFdr2', false, false),
-- password: ss7EE4ENb9HlR11
 ('emory.marvin86', 'scottie81@yahoo.com', '$2b$10$goM/KF9UQ6b.vLEeonVOxOvvtMCo2CBIliUQ.3POalmmHWuGM4JVa', false, false),
-- password: AJeXamWVDy7xqCF
 ('sigrid.hartmann', 'payton.dibbert5@hotmail.com', '$2b$10$65DNaXMErscgIF025ICeB.b7mMaF7w34rU7RMyjrGp02iZWPXjRZq', false, false),
-- password: zK0snoOw38eJDtN
 ('armand64', 'ariel.jones28@hotmail.com', '$2b$10$8KRiWksPgwuEdywcdjHaZO78fXSm08iP2a8qPnM8LuLocByFhs8ia', false, false),
-- password: 9o3nSnEB6j0MecL
 ('elisabeth_renner', 'troy99@hotmail.com', '$2b$10$yCfTofnmBjQaDvMz.CCO1OdxF/c.YcY2ciIyxdwUJfetHiQj8tY/O', false, false),
-- password: 3ET1nOP36ZZ8CVn
 ('sandrine_abshire', 'baby.kreiger56@yahoo.com', '$2b$10$FkSM0v0Odw8xk4wIc7auvuCWE03k3D1mx7f6uvhnYFSdiWjPrFKjO', false, false),
-- password: LvW8scTYL3CsH3q
 ('margie84', 'agustina84@hotmail.com', '$2b$10$tS9aUzHdpKqxTsyWADIrGOm4JtwtEzXcA5J0i.2B3fnyMPvRf83DO', false, false),
-- password: B7ZY0LlOX86EOMg
 ('bulah74', 'nathanial16@yahoo.com', '$2b$10$0K6MeuOKb3UrMw8BDVkm.Omo.DsRVlBnpt5gJLbqrNhXKgyrs6q9q', false, false),
-- password: IKfWDAXZoUe3S5r
 ('yazmin.greenfelder', 'arlie_price@hotmail.com', '$2b$10$2y1vAnZDjmCs2fjvPJfVA.HxoiUoXnrqtQ4fkovGmBp9Bt.NneUDy', false, false),
-- password: 3xkEL2oIoOgolpc
 ('kimberly_daniel53', 'jacynthe56@yahoo.com', '$2b$10$wzCDaPTLAl6GTUoNjnEjHeD8LSEWwznSb.yqQvg6DMdzRsdPkrH1C', false, false),
-- password: JpHLv4TFzKmlZ4w
 ('rashawn78', 'geovanny_murazik74@yahoo.com', '$2b$10$2mpPB4x8Vq0aEe9qY6NPfu9vdiUKmXw4UQ1Hi2w3PVz1wGIE7.XQ2', false, false),
-- password: uNGFlPdmsgC11Hn
 ('breana.swaniawski85', 'alayna.walter19@yahoo.com', '$2b$10$dfpLc4pCdSjUsWFj/INQgObkITR0xvhJ5SSBuQc4hB.BbDNPjg9HC', false, false),
-- password: QWf1IQSSECp6NsT
 ('viva.lynch', 'ludie18@yahoo.com', '$2b$10$MzkfjLxw4xD2h99nsUZE5uXV9dSpxilpdVAEMmFC8vYggoixACZqW', false, false),
-- password: BJrsSb0IP1Qwimc
 ('deonte.crona', 'amie.stiedemann@gmail.com', '$2b$10$MSJI0FKt40R./Ahjykl6meK/q1TB9rHkBpPhFPNW91dBrVWD7awkm', false, false),
-- password: PN4cis8nnDyUScc
 ('damaris_oreilly3', 'may69@yahoo.com', '$2b$10$lHRWDpQK5RKsX962grWXaOy/N/6pNANmkhQPvqHGI9MsOW9uxFUuW', false, false),
-- password: vdsDRJDYiykTvWO
 ('luigi79', 'griffin_nikolaus66@hotmail.com', '$2b$10$r6gMt97MEEVRdUQYkvS4QOM0kFs.F5UfURgrw935MD8sYzEpF5Cx6', false, false),
-- password: 5RKn3a9b8pxHQ1N
 ('alexa.schaden', 'rowena_heaney51@yahoo.com', '$2b$10$fb4p6dsBIRMyhZi02ZM6euC4aMZu8uwlYK6Ygpexh5l4NUNNqoIRi', false, false),
-- password: tWMMY2xAS97gOrC
 ('garret31', 'hubert_davis@gmail.com', '$2b$10$UxXo6eN.B0kG4UorS8yN2uiWHMiSFAmlQ6epnWlGN.kY88bYqjq96', false, false),
-- password: Oj5p3oXyjfwGFKI
 ('pete55', 'preston62@yahoo.com', '$2b$10$cexVwCviYqYdBynnGzFeaeAQVWNYlWIPQ3Shh69zutCK9X/8ZAmFW', false, false),
-- password: eeJO_3vkn6HhlNb
 ('conrad_gerlach', 'shawna.roob22@hotmail.com', '$2b$10$WynMoAjDAhZ1AKvNeNdBNOCajMsgXHxtelmAxDnkS2fXntW3rFwoy', false, false),
-- password: TFtppessheCpJGA
 ('maryjane.auer', 'nova_dietrich@hotmail.com', '$2b$10$lDSAbPpXb22.Y.JfyxpFS.GecLmiU1OoAIC3SivJNRQWatY26RfnK', false, false),
-- password: aF0hv7PwOdW2M4f
 ('joanny11', 'lavada.davis91@gmail.com', '$2b$10$zV2VZ9kbUfnFvnEtWw.iE.f26zm5IbdvNTGDKWcI3jvU0UU0dOws6', false, false),
-- password: nt4rhzc82UU1kPx
 ('desiree.hoppe22', 'dahlia.stracke@yahoo.com', '$2b$10$vrYGluMc99g7a4G3yZeCyOdidY9LvESQzD9mvklf8Z4jwqpydqqMi', false, false),
-- password: wDtnOnfHApOowy7
 ('camila_botsford', 'johnson_marks90@hotmail.com', '$2b$10$vb/pWZWIbz/6uNlyQE6wO.ooOa1lgR7UNHi221a45KdIK6UwX9RHm', false, false),
-- password: 9sl7F9jrQYT8Ydw
 ('horacio45', 'magdalena_kautzer@gmail.com', '$2b$10$kQCX.P8v0t1eRl6JTNH4lO6oIIhD7rL0p608vF/3wAq2XqToKhOVe', false, false),
-- password: Zl1ke4XKwzhE9Wn
 ('tristian_cummerata', 'jevon_schuppe66@gmail.com', '$2b$10$jCwMFU4lvA90cKP0PA1v2OyXK13d6paPwtCgqDmKObacOdo4Gm0J2', false, false),
-- password: kt1jzjpidrA5tXY
 ('brown_reynolds81', 'lexie.feil24@yahoo.com', '$2b$10$rMwxs9k9KMrdu15epRX70uGWhi5okTaE/e0gjtBiDgSSiBwgxCaYS', false, false),
-- password: E73L8efG02dORjC
 ('alexandrea.torphy', 'armando_stanton@yahoo.com', '$2b$10$akSYrw.UatJmC5HA1.bowOWkybCQA8k3l8ynQfbzxMTrZKFiJYrba', false, false),
-- password: 1NMi425pkbJKLPS
 ('glenna.beahan81', 'herbert.stark5@hotmail.com', '$2b$10$GTNhJBCHa9bzBZWZuCT3iOGrBwmPDMfidMEkd2LLLPTZOl36ZkY1.', false, false),
-- password: AwQFxp0q4WRBxgW
 ('alessia17', 'harrison.jakubowski57@hotmail.com', '$2b$10$VgO.FS5kobOzYOazR8bAGOQPFcG3F4YbCbzam6amCiFIgGrVkl4Aa', false, false),
-- password: uYvKr5yUJsWIb0e
 ('kaylah.bergstrom', 'ola60@hotmail.com', '$2b$10$0vWlycQavcDBMpkAQLtaeuPuP.1BkH6Tz6nxdHQVEPtIagldTKuMW', false, false),
-- password: UUYHHkHf0roJKmO
 ('viviane_senger', 'declan20@hotmail.com', '$2b$10$DoINweakNDjVy8WPXp3b8.VA63WxThvQdcbvHE/NfOuUtojWBaUYC', false, false),
-- password: tdphA1vbqfG03Z0
 ('shaylee.walter', 'frederic.renner@gmail.com', '$2b$10$sYw/qX1ner2pvT1c5EHFfO3ENMhwe/prMMGfYL8Ut6JXp9fqLe8Wa', false, false),
-- password: CKQRdyq3ASDgs0v
 ('pete56', 'josefa_baumbach46@hotmail.com', '$2b$10$vNB22.y.DQ58oR2r7rqprOtL8y2r1APjLtikHJ6HgX9x.i0YaEIzi', false, false),
-- password: jykNm_rs1Hkz4Mc
 ('americo67', 'bria.kovacek@hotmail.com', '$2b$10$IIDOUSc4DMQwSs/CqsfELODZR0w6zQuj6f0c7gbBPEr1V1.XEXrES', false, false),
-- password: finalguy
('final2025','feffthegoat2025@mail.com','$2b$10$/ImRjPj9FV9n6qkr9XUzX.0f3yTCXMeaUk4zD2gey8rbU4xks0toy',false,false);
