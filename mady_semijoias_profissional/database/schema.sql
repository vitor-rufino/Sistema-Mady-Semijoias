CREATE DATABASE IF NOT EXISTS mady_semijoias
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mady_semijoias;

DROP TABLE IF EXISTS user_products;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  phone VARCHAR(30),
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'cliente') NOT NULL DEFAULT 'cliente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  status ENUM('comprado', 'revenda') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Senha do administrador: 123456
INSERT INTO users (name, email, phone, password, role)
VALUES (
  'Administrador Mady',
  'admin@madysemijoias.com',
  NULL,
  '$2a$10$52.KITl5fC2tclH/ZuQc7.8/xNwux7LMoMNU..icXjYbH9tiAg43u',
  'admin'
);

INSERT INTO products (name, description, price, quantity, image) VALUES
('Anel delicado', 'Semijoia delicada para uso diário.', 79.90, 10, NULL),
('Colar coração', 'Colar elegante com pingente de coração.', 119.90, 8, NULL),
('Brinco luxo', 'Brinco moderno para ocasiões especiais.', 59.90, 15, NULL);
