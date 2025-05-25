-- Create database
CREATE DATABASE IF NOT EXISTS hamutea_db;
USE hamutea_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INT DEFAULT 0,
  category ENUM('Classic Milktea Series', 'Fresh Milk Tea', 'Fresh Fruit', 'Milkshake', 'Pure Tea') NOT NULL,
  image_url VARCHAR(255),
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'ready_for_pickup', 'completed', 'cancelled') DEFAULT 'pending',
  shipping_address TEXT,
  payment_method ENUM('cash', 'ecash') DEFAULT 'cash',
  payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Insert admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@hamutea.com', '$2a$10$mLK.rrdlvx9DCFb6Eck1t.TlltnGulepXnov3bBp5T.JwJ1p5CWsG', 'admin');

-- Insert sample products
INSERT INTO products (name, description, price, stock_quantity, category, image_url) VALUES 
('Pearl Milk Tea', 'Classic milk tea with chewy tapioca pearls', 90.00, 100, 'Classic Milktea Series', '/images/pearl-milk-tea.jpg'),
('Black Sugar Pearl Milk Tea', 'Rich milk tea with black sugar syrup and pearls', 110.00, 100, 'Classic Milktea Series', '/images/black-sugar-pearl-milk-tea.jpg'),
('Black Sugar Pearl Fresh Milk', 'Fresh milk with black sugar syrup and pearls', 120.00, 100, 'Fresh Milk Tea', '/images/black-sugar-fresh-milk.jpg'),
('Passion QQ', 'Refreshing passion fruit tea with chewy pearls', 100.00, 100, 'Fresh Fruit', '/images/passion-qq.jpg'),
('Yogurt Shake', 'Creamy yogurt shake with a smooth texture', 100.00, 100, 'Milkshake', '/images/yogurt-shake.jpg'),
('Green Tea', 'Pure and refreshing green tea', 60.00, 100, 'Pure Tea', '/images/green-tea.jpg');

-- Insert sample orders
INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_method, payment_status) VALUES 
(1, 60.97, 'completed', '123 Tea St, Tea City, TC 12345', 'cash', 'paid'),
(1, 45.50, 'processing', '123 Tea St, Tea City, TC 12345', 'ecash', 'paid');

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES 
(1, 1, 2, 15.99),
(1, 2, 2, 14.99),
(2, 3, 1, 45.50);