import express from "express";
const app = express();
const port = process.env.PORT || 1200;
import client from "./db-client.js";

app.get("/", async (req, res) => {
  let conn;
  try {
    conn = await client.connect();
    console.log("Connected to PostgreSQL");

    const result = await conn.query("SELECT * FROM users");
    console.log("Result:", result.rows);

    res.send("Hello World!");
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).send("Internal Server Error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
