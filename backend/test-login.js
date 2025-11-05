// Test script pour vérifier la connexion
// Usage: node test-login.js <email> <password>

const email = process.argv[2] || 'test@test.com';
const password = process.argv[3] || 'test123';

console.log(`Testing login for: ${email}`);

fetch('http://localhost:5001/api/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password })
})
  .then(response => response.json())
  .then(data => {
    console.log('Response:', JSON.stringify(data, null, 2));
  })
  .catch(error => {
    console.error('Error:', error);
  });
