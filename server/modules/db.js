require("dotenv").config({ quiet: true });
const mysql = require("mysql2/promise");

// اتصال مشترك (pool) — كل الاستعلامات بترجع Promise
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: "utf8mb4",
    timezone: "Z",
    decimalNumbers: true,
    connectionLimit: Number(process.env.DB_POOL_SIZE) || 10,
});

// كل اتصال جديد: توقيت UTC + وضع صارم
// (بدون الوضع الصارم MariaDB بتقص البيانات بصمت بدل ما ترفضها)
pool.pool.on("connection", (conn) => {
    conn.query(
        "SET time_zone = '+00:00', sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'"
    );
});

// تنفيذ عدة استعلامات كوحدة وحدة: إما تنجح كلها أو ولا وحدة
async function transaction(work) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const result = await work(conn);
        await conn.commit();
        return result;
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}

module.exports = pool;
module.exports.transaction = transaction;
