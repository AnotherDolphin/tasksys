import client from "../db-client.js";

const TaskStore = {
  async getAll() {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM tasks";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  async add(title, description, created_by) {
    try {
      const conn = await client.connect();
      const sql = "INSERT INTO tasks (title, description, created_by) VALUES ($1, $2, $3) RETURNING *";
      const result = await conn.query(sql, [title, description, created_by]);      
      conn.release();
      return result.rows[0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  async delete(id) {
    try {
      const conn = await client.connect();
      const sql = "DELETE FROM tasks WHERE id=$1";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};

export default TaskStore;
