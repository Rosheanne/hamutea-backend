const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createAdmin() {
  try {
    // Generate password hash
    const password = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log('Generated password hash:', hashedPassword);
    
    // Connect to database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    
    console.log('Connected to database');
    
    // Check if admin exists
    const [existingUsers] = await connection.execute(
      'SELECT * FROM users WHERE email = ?', 
      ['admin@hamutea.com']
    );
    
    if (existingUsers.length > 0) {
      // Update existing admin
      await connection.execute(
        'UPDATE users SET password = ? WHERE email = ?',
        [hashedPassword, 'admin@hamutea.com']
      );
      console.log('Admin password updated successfully');
    } else {
      // Create new admin
      await connection.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin User', 'admin@hamutea.com', hashedPassword, 'admin']
      );
      console.log('Admin user created successfully');
    }
    
    // Create a second admin user
    const [existingUsers2] = await connection.execute(
      'SELECT * FROM users WHERE email = ?', 
      ['admin2@hamutea.com']
    );
    
    if (existingUsers2.length === 0) {
      await connection.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin User 2', 'admin2@hamutea.com', hashedPassword, 'admin']
      );
      console.log('Second admin user created successfully');
    }
    
    await connection.end();
    console.log('Database connection closed');
    
    console.log('\nAdmin credentials:');
    console.log('Email: admin@hamutea.com');
    console.log('Password: admin123');
    console.log('\nAlternative admin credentials:');
    console.log('Email: admin2@hamutea.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error:', error);
  }
}

createAdmin();