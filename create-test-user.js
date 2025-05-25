const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createTestUser() {
  try {
    // Create a simple password hash for testing
    const password = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log('Generated hash for password:', hashedPassword);
    
    // Connect to the database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    
    // Insert a new test admin user
    const [result] = await connection.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Test Admin', 'testadmin@example.com', hashedPassword, 'admin']
    );
    
    console.log('User created with ID:', result.insertId);
    console.log('You can now login with:');
    console.log('Email: testadmin@example.com');
    console.log('Password: admin123');
    
    await connection.end();
  } catch (error) {
    console.error('Error creating test user:', error);
  }
}

createTestUser();