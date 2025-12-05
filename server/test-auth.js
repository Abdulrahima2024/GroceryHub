import dotenv from 'dotenv';
import process from 'process';

// Use native fetch (Node 18+). This script performs login and then calls is-auth
// Usage:
//   node test-auth.js
// Optional env vars:
//   TEST_BASE_URL (default http://localhost:4000)
//   TEST_EMAIL, TEST_PASSWORD

dotenv.config();

const BASE = process.env.TEST_BASE_URL || 'http://localhost:4000';
const EMAIL = process.env.TEST_EMAIL || 'user@example.com';
const PASSWORD = process.env.TEST_PASSWORD || 'password';

async function run() {
  try {
    console.log('Using base URL:', BASE);
    console.log('Logging in as:', EMAIL);

    const loginResp = await fetch(`${BASE}/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    });

    const loginJson = await loginResp.json().catch(() => null);
    console.log('\n/login response status:', loginResp.status);
    console.log('login body:', loginJson);

    const token = loginJson?.token;
    if (!token) {
      console.error('\nNo token received from login. Aborting.');
      process.exitCode = 2;
      return;
    }

    console.log('\nCalling /api/user/is-auth with Authorization header...');
    const authResp = await fetch(`${BASE}/api/user/is-auth`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const authJson = await authResp.json().catch(() => null);
    console.log('/api/user/is-auth status:', authResp.status);
    console.log('is-auth body:', authJson);
  } catch (err) {
    console.error('test-auth error:', err);
    process.exitCode = 1;
  }
}

run();
