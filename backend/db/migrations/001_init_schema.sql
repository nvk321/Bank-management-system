-- 001_init_schema.sql
-- Basic schema for bank-management app

CREATE TABLE IF NOT EXISTS `user` (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','customer','employee') NOT NULL DEFAULT 'customer',
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `branch` (
  branch_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `customer` (
  customer_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES `user`(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `employee` (
  employee_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  branch_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES `user`(user_id) ON DELETE CASCADE,
  FOREIGN KEY (branch_id) REFERENCES branch(branch_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS `account` (
  account_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  branch_id INT,
  type VARCHAR(50) NOT NULL,
  balance DECIMAL(15,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE,
  FOREIGN KEY (branch_id) REFERENCES branch(branch_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS `transaction` (
  transaction_id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  type ENUM('deposit','withdraw','transfer') NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  meta JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES account(account_id) ON DELETE CASCADE
);
