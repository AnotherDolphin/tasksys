import express from "express";
import client from "./db-client.js";
import UserRouter from "./routes/users.js";
import TaskRtouer from "./routes/tasks.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
// const istest = process.env.NODE_ENV === "test";

const app = express();
app.use(cors());

app.use(express.json());
app.use("/users", UserRouter);
app.use("/tasks", TaskRtouer);

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get("/", async (req, res) => {
  let conn;
  try {
    conn = await client.connect();
    console.log("Connected to PostgreSQL");
    const result = await conn.query("SELECT * FROM users");
    console.log("Result:", result.rows);
    res.send("Hello Tasksys dudes!");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

export default app;
