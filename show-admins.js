const { Pool } = require('pg');

// PostgreSQL connection configuration
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_0YAPoUMWLRV7@ep-muddy-star-a1fxuehu-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function showAdmins() {
  let client;
  try {
    console.log('Connecting to PostgreSQL database...');
    client = await pool.connect();
    console.log('Connected successfully!');

    // Show all admin users
    console.log('\n=== All Admin Users ===');
    const adminsResult = await client.query('SELECT id, username, "createdAt" FROM "Admin"');
    
    if (adminsResult.rows.length === 0) {
      console.log('No admin users found in the database');
      return;
    }

    console.log(`Found ${adminsResult.rows.length} admin user(s):`);
    adminsResult.rows.forEach(admin => {
      console.log(`- Username: ${admin.username}`);
      console.log(`  ID: ${admin.id}`);
      console.log(`  Created: ${admin.createdAt}`);
      console.log('');
    });

    // Test admin login (without password verification)
    console.log('=== Admin Login Test ===');
    const testAdmin = adminsResult.rows[0];
    console.log(`Admin username '${testAdmin.username}' exists in the database`);
    console.log('You can use this username to login to the admin panel');

  } catch (error) {
    console.error('Error showing admins:', error);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

showAdmins();