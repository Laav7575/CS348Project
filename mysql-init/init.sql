CREATE DATABASE IF NOT EXISTS cs348_project;

USE cs348_project;

CREATE TABLE IF NOT EXISTS users (
  uid INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100)
);

INSERT INTO users (name) VALUES 
('Angela'), 
('Gloria'), 
('Laavanya'), 
('Jahnavi'), 
('Alexia');
