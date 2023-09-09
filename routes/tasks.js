import { Router } from "express";
import TaskStore from "../models/task.js";

const router = Router();
const store = new TaskStore();

router.get("/", async (req, res) => {
  const tasks = await store.getAll();
  res.send(tasks);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const task = await store.getById(id);
  if (!task) return res.status(404).send("Task not found");
  res.send(task);
});

router.post("/", async (req, res) => {
  try {
    const { title, description, user } = req.body;
    if (!title) return res.status(400).send("title is required");
    if (!description) return res.status(400).send("description is required");
    if (!user) return res.status(400).send("user is required");
    const newTask = await store.add(title, description, user);
    res.status(201).send(newTask);
  } catch (error) {
    console.error(error);
    res.status(422).send(error.detail || error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await store.delete(id);
    res.send("Task deleted");
  } catch (error) {
    res.status(error.statusCode?? 422).send(error.message)
  }
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
    res.status(error.statusCode?? 422).send(error.detail || error.message);
  }
});

router.put("/:id/assign", async (req, res) => {
  try {
    const { id } = req.params;
    const { user, newUser } = req.body;
    if (!user) return res.status(400).send("user is required");
    if (!newUser) return res.status(400).send("newUser is required");
    const updatedTask = await store.reassignTask(id, user, newUser);
    res.send(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode?? 422).send(error.detail || error.message);
  }
});

export default router;
