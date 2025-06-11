USE cs348_project;

create table IF NOT EXISTS Users (
    uID AUTO_INCREMENT not NULL,
    username VARCHAR(30) UNIQUE,
    email VARCHAR(30) UNIQUE,
    userPassword VARCHAR(30),
    primary key(uID)
);