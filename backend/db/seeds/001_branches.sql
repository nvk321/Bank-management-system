-- 001_branches.sql
INSERT INTO branch (name, location) VALUES
('Central Branch','Main Street'),
('North Branch','North Avenue'),
('South Branch','South Road')
ON DUPLICATE KEY UPDATE name = VALUES(name);
