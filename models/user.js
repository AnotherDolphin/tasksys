import client from "../db-client.js";

class UserStore {
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
  }

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
  }

  async add(username) {
    try {
      const conn = await client.connect();
      await conn.query("BEGIN");
      // Check if username already exists
      const checkSql = "SELECT * FROM users WHERE username=$1";
      const checkResult = await conn.query(checkSql, [username]);
      if (checkResult.rows.length > 0)
        throw new Error("Username already exists");

      // Insert new user
      const insertSql = "INSERT INTO users (username) VALUES ($1) RETURNING *";
      const insertResult = await conn.query(insertSql, [username]);
      await conn.query("COMMIT");
      conn.release();
      return insertResult.rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(err);
      throw err;
    }
  }

  async delete(id) {
    try {
      const conn = await client.connect();
      const sql = "DELETE FROM users WHERE id=$1";
      await conn.query(sql, [id]);
      conn.release();
    } catch (err) {
      throw err;
    }
  }
}

export default UserStore;
