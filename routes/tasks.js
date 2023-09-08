import { Router } from "express";
import TaskStore from "../models/task.js";

const router = Router();

router.get("/", async (req, res) => {
  const tasks = await TaskStore.getAll();
  res.send(tasks);
});

router.post("/", async (req, res) => {
  const { title, description, user } = req.body;
  if (!title) return res.status(400).send("title is required");
  if (!description) return res.status(400).send("description is required");
  if (!user) return res.status(400).send("user is required");
  const newTask = await TaskStore.add(title, description, user);
  res.send(newTask);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await TaskStore.delete(id);
  res.send("Task deleted");
});

export default router;
