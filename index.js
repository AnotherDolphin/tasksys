import express from "express";
import client from "./db-client.js";
import UserRouter from "./routes/users.js";
import TaskRtouer from "./routes/tasks.js";

const app = express();
const port = process.env.PORT || 1200;

app.use(express.json());
app.use("/users", UserRouter);
app.use("/tasks", TaskRtouer);

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
