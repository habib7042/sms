const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// PostgreSQL connection configuration
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_0YAPoUMWLRV7@ep-muddy-star-a1fxuehu-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function createNewAdmin() {
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

    // Create new admin credentials
    console.log('\n=== Creating new admin user ===');
    const adminUsername = 'superadmin';
    const adminPassword = 'admin123'; // You can change this
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    // Check if username already exists
    const existingAdmin = await client.query('SELECT * FROM "Admin" WHERE username = $1', [adminUsername]);
    
    if (existingAdmin.rows.length > 0) {
      console.log(`Username '${adminUsername}' already exists. Creating with different username...`);
      const adminUsername2 = 'administrator';
      const existingAdmin2 = await client.query('SELECT * FROM "Admin" WHERE username = $1', [adminUsername2]);
      
      if (existingAdmin2.rows.length > 0) {
        console.log(`Username '${adminUsername2}' also exists. Let's reset the password for existing admin...`);
        
        // Reset password for existing admin
        await client.query('UPDATE "Admin" SET password = $1, "updatedAt" = NOW() WHERE username = $2', [hashedPassword, 'admin']);
        console.log('✅ Password reset for existing admin user!');
        console.log(`📝 Username: admin`);
        console.log(`🔑 New Password: ${adminPassword}`);
        console.log(`⚠️  Please change the password after first login`);
      } else {
        // Create new admin with administrator username
        const adminId = generateUUID();
        await client.query(`
          INSERT INTO "Admin" (id, username, password, "createdAt", "updatedAt")
          VALUES ($1, $2, $3, NOW(), NOW())
        `, [adminId, adminUsername2, hashedPassword]);

        console.log('✅ New admin user created successfully!');
        console.log(`📝 Username: ${adminUsername2}`);
        console.log(`🔑 Password: ${adminPassword}`);
        console.log(`⚠️  Please change the password after first login`);
      }
    } else {
      // Create new admin
      const adminId = generateUUID();
      await client.query(`
        INSERT INTO "Admin" (id, username, password, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, NOW(), NOW())
      `, [adminId, adminUsername, hashedPassword]);

      console.log('✅ New admin user created successfully!');
      console.log(`📝 Username: ${adminUsername}`);
      console.log(`🔑 Password: ${adminPassword}`);
      console.log(`⚠️  Please change the password after first login`);
    }

    // Show all admin users
    console.log('\n=== All Admin Users ===');
    const allAdmins = await client.query('SELECT id, username, "createdAt" FROM "Admin"');
    allAdmins.rows.forEach(admin => {
      console.log(`- ${admin.username} (ID: ${admin.id}, Created: ${admin.createdAt})`);
    });

    console.log('\n=== Login Information ===');
    console.log('You can use the following credentials to login to the admin panel:');
    console.log('🌐 URL: http://localhost:3000/admin');
    console.log('📝 Username: admin');
    console.log('🔑 Password: admin123');
    console.log('⚠️  IMPORTANT: Change the password after first login for security');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

createNewAdmin();