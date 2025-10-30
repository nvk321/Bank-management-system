import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Support both individual env vars and a single DATABASE_URL (mysql://user:pass@host:port/db)
const {
  DATABASE_URL,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_CONN_LIMIT,
  DB_SSL,
  DB_SSL_CA,
  DB_SSL_REJECT_UNAUTHORIZED,
} = process.env;

const poolConfig = {
  waitForConnections: true,
  connectionLimit: Number(DB_CONN_LIMIT || 10),
  queueLimit: 0,
  multipleStatements: true,
};

if (DATABASE_URL) {
  try {
    const url = new URL(DATABASE_URL);
    poolConfig.host = url.hostname;
    if (url.port) poolConfig.port = Number(url.port);
    poolConfig.user = decodeURIComponent(url.username);
    poolConfig.password = decodeURIComponent(url.password);
    poolConfig.database = url.pathname ? url.pathname.replace(/^\//, "") : undefined;
  } catch (err) {
    console.error("Invalid DATABASE_URL:", err);
  }
} else {
  poolConfig.host = DB_HOST || "localhost";
  if (DB_PORT) poolConfig.port = Number(DB_PORT);
  poolConfig.user = DB_USER || "root";
  poolConfig.password = DB_PASSWORD || "";
  poolConfig.database = DB_NAME || "bank_db";
}

// Simple SSL support: set DB_SSL=true to enable. Optionally provide DB_SSL_CA and DB_SSL_REJECT_UNAUTHORIZED
if (DB_SSL === "true") {
  poolConfig.ssl = {
    // If a CA is provided, pass it through. For many providers, you can set rejectUnauthorized to false.
    ...(DB_SSL_CA ? { ca: DB_SSL_CA } : {}),
    rejectUnauthorized: DB_SSL_REJECT_UNAUTHORIZED === "true",
  };
}

const pool = mysql.createPool(poolConfig);

// simple connectivity check
(async () => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log("✅ Connected to MySQL Database (pool)");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
})();

export default pool;
