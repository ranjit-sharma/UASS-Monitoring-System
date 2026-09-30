const http = require('http');

async function testApi() {
  const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@uass.local', password: 'password123' })
  });
  const data = await loginRes.json();
  const cookie = loginRes.headers.get('set-cookie');
  
  if (!cookie) {
    console.error('Login failed!', data);
    return;
  }

  const startRes = await fetch('http://localhost:5000/api/v1/collections/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify({ sessionName: 'Test' })
  });
  console.log('Start status:', startRes.status);
  const startData = await startRes.json();
  console.log('Start response:', startData);
}

testApi();
