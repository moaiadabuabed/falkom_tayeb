const oracledb = require('oracledb');
const dotenv = require('dotenv');

dotenv.config();

// تحويل نتائج الاستعلام إلى JSON Objects وقراءة نصوص الـ CLOB تلقائياً كـ String
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;
oracledb.fetchAsString = [ oracledb.CLOB ];

async function initializePool() {
  try {
    await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1
    });
    console.log('✅ Oracle Database Connection Pool initialized successfully.');
  } catch (err) {
    console.error('❌ Database initialization error:', err.message);
    process.exit(1);
  }
}

async function executeQuery(sql, binds = {}, options = {}) {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(sql, binds, options);
    return result.rows !== undefined ? result.rows : result;
  } catch (err) {
    console.error('❌ Execution Error:', err.message);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('❌ Connection close error:', err.message);
      }
    }
  }
}

module.exports = { initializePool, executeQuery };