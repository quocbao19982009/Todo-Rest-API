import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: "todo_database",
  host: "localhost",
  port: 5432,
});

export default pool;
