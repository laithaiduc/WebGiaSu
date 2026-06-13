import mysql from 'mysql2/promise';

const {
  MYSQL_HOST = 'mysql-1732200e-haytrao12-2d67.e.aivencloud.com',
  MYSQL_PORT = '25240',
  MYSQL_USER = 'avnadmin',
  MYSQL_PASSWORD = 'MAT_KHAU_TREN_AIVEN_CUA_ONG', // Bật mắt 👁️ bên Aiven để copy mật khẩu thật vào đây
  MYSQL_DATABASE = 'defaultdb',
} = process.env;

const pool = mysql.createPool({
  host: MYSQL_HOST,
  port: Number(MYSQL_PORT),
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  ssl: {
    rejectUnauthorized: false, // Bắt buộc phải thêm dòng này để bypass SSL của Aiven khi kết nối từ xa
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query<T = any>(sql: string, values: Array<unknown> = []) {
  const [rows] = await pool.query(sql, values);
  return rows as T;
}

export default pool;