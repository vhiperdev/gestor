import mysql, { Connection, Pool, MysqlError } from "mysql";
import * as fs from "fs";
import * as path from "path";

const caFilePath = path.resolve('cert', "ca-certificate.crt"); // Ganti dengan nama file CA certificate Anda



const dbConfig: mysql.PoolConfig = {
  host: process.env.DATABASE_URL,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT,
  // connectionLimit: 10, // Sesuaikan dengan kebutuhan Anda
  ssl: {
    ca: fs.readFileSync(caFilePath),
  },
};

let pool: Pool;

// Fungsi untuk membuat pool koneksi ke database
const createPool = () => {
  pool = mysql.createPool(dbConfig);

  // Tangani acara kesalahan dan mencoba menghubungkan kembali
  pool.on("error", (err: MysqlError) => {
    console.error("MySQL pool error:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
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
        console.error("Error executing MySQL query:", err);
        reject(err);
      } else {
        resolve(results);
        // pool.end()
      }
    });
  });
};

export { createPool, executeQuery };
