const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// PostgreSQL connection configuration
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_0YAPoUMWLRV7@ep-muddy-star-a1fxuehu-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function createAdmin() {
  let client;
  try {
    console.log('Connecting to PostgreSQL database...');
    client = await pool.connect();
    console.log('Connected successfully!');

    // Helper function to generate UUID
    function generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    // Check if admin already exists
    console.log('\n=== Checking existing admin users ===');
    const existingAdmin = await client.query('SELECT * FROM "Admin" WHERE username = $1', ['admin']);
    
    if (existingAdmin.rows.length > 0) {
      console.log('Admin user already exists:');
      console.log(`- Username: ${existingAdmin.rows[0].username}`);
      console.log(`- Created: ${existingAdmin.rows[0].createdAt}`);
      return;
    }

    // Create admin password (hashed)
    console.log('\n=== Creating admin user ===');
    const adminPassword = 'admin123'; // You can change this
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    // Insert admin user
    const adminId = generateUUID();
    await client.query(`
      INSERT INTO "Admin" (id, username, password, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, NOW(), NOW())
    `, [adminId, 'admin', hashedPassword]);

    console.log('✅ Admin user created successfully!');
    console.log(`📝 Username: admin`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log(`⚠️  Please change the password after first login`);

    // Verify admin creation
    console.log('\n=== Verifying admin creation ===');
    const verifyAdmin = await client.query('SELECT * FROM "Admin" WHERE username = $1', ['admin']);
    if (verifyAdmin.rows.length > 0) {
      console.log('✅ Admin user verified in database');
      console.log(`- ID: ${verifyAdmin.rows[0].id}`);
      console.log(`- Username: ${verifyAdmin.rows[0].username}`);
      console.log(`- Created: ${verifyAdmin.rows[0].createdAt}`);
    }

    // Show all admin users
    console.log('\n=== All admin users ===');
    const allAdmins = await client.query('SELECT id, username, "createdAt" FROM "Admin"');
    allAdmins.rows.forEach(admin => {
      console.log(`- ${admin.username} (ID: ${admin.id}, Created: ${admin.createdAt})`);
    });

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

createAdmin();