import client from "../db-client.js";

const UserStore = {
  async getAll() {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM users";
      const result = await conn.query(sql);      
      conn.release();
      return result.rows;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async getByUsername(username) {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM users WHERE username=$1";
      const result = await conn.query(sql, [username]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async add(username) {
    try {
      const conn = await client.connect();
      const sql = "INSERT INTO users (username) VALUES ($1) RETURNING *";
      const result = await conn.query(sql, [username]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};

export default UserStore;
