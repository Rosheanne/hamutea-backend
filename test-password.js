const bcrypt = require('bcryptjs');

async function testPassword() {
  const plainPassword = 'password123';
  const storedHash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
  
  const isMatch = await bcrypt.compare(plainPassword, storedHash);
  console.log('Password match:', isMatch);
}

testPassword();
