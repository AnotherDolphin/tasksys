import { Router } from "express";
import TaskStore from "../models/task.js";

const router = Router();
const store = new TaskStore();

router.get("/", async (req, res) => {
  const tasks = await store.getAll();
  res.send(tasks);
});

router.post("/", async (req, res) => {
  const { title, description, user } = req.body;
  if (!title) return res.status(400).send("title is required");
  if (!description) return res.status(400).send("description is required");
  if (!user) return res.status(400).send("user is required");
  const newTask = await store.add(title, description, user);
  res.send(newTask);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await store.delete(id);
  res.send("Task deleted");
});

router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { user, status } = req.body;
    if (!user) return res.status(400).send("user is required");
    const updatedTask = await store.updateStatus(id, status, user);
    res.send(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(422).send(error.message);
  }
});



export default router;
