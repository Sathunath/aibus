import mysql from 'mysql2/promise';

async function testConnection(host) {
  console.log(`Testing host: ${host}`);
  try {
    const connection = await mysql.createConnection({
      host: host,
      user: 'u240981709_aibusiness',
      password: 'Wh8RY!+Zw4',
      database: 'u240981709_aibusiness',
      connectTimeout: 5000
    });
    console.log(`SUCCESS connected to ${host}!`);
    const [rows] = await connection.execute('SELECT NOW() as server_time');
    console.log('Server time:', rows[0].server_time);
    await connection.end();
    return true;
  } catch (err) {
    console.log(`Failed ${host}: ${err.message}`);
    return false;
  }
}

async function main() {
  const hosts = [
    'srv665.hstgr.io',
    '82.25.121.116',
    'sql.hostinger.com',
    'mysql.hostinger.com'
  ];
  for (const h of hosts) {
    await testConnection(h);
  }
}

main();

