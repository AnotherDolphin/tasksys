import pkg from 'pg';
const { Pool } = pkg;

const config = {
  host: "localhost",
  port: 5432,
  database: "tasksys",
  password: "0000",
  user: "postgres",
};

const pool = new Pool(config);

export default pool;