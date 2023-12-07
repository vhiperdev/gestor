import mysql, { Connection, Pool, MysqlError } from 'mysql';

const dbConfig: mysql.PoolConfig = {
  host: process.env.DATABASE_URL,
  user: process.env.DATABASE_USERNAME,
  // password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 10, // Sesuaikan dengan kebutuhan Anda
};

let pool: Pool;

// Fungsi untuk membuat pool koneksi ke database
const createPool = () => {
  pool = mysql.createPool(dbConfig);

  // Tangani acara kesalahan dan mencoba menghubungkan kembali
  pool.on('error', (err: MysqlError) => {
    console.error('MySQL pool error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      createPool(); // Coba buat pool koneksi baru
    } else {
      throw err;
    }
  });
};

// Fungsi untuk eksekusi query SQL
const executeQuery = (query: string, values: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    pool.query(query, values, (err: MysqlError | null, results?: any) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        reject(err);
      } else {
        pool.end()
        resolve(results);
      }
    });
  });
};

export { createPool, executeQuery };
