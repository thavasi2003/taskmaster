import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  port: process.env.DB_PORT || 3306,   // ✅ IMPORTANT FIX
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('   Host:', process.env.DB_HOST);
    console.error('   User:', process.env.DB_USER);
    console.error('   Port:', process.env.DB_PORT);
  } else {
    console.log('✅ Connected to MySQL Database');
    connection.release();
  }
});

export default db.promise();
