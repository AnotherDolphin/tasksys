import { Router } from "express";
import UserStore from "../models/user.js";

const router = Router();
const userStore = new UserStore();

router.get("/", async (req, res, next) => {
  const users = await userStore.getAll();
  res.json(users);
});

try {
  router.get("/:username", async (req, res, next) => {
    const { username } = req.params;    
    if (!username) return res.status(400).send("username is required");
    const user = await userStore.getByUsername(username);
    if (!user) return res.status(404).send("User not found");
    res.send(user);
  });
} catch (error) {
  res.status(422).send(error.message);
}

router.post("/", async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).send("username is required");
    const user = await userStore.add(username);
    res.send(user);
  } catch (error) {
    res.status(422).send(error.message);
  }
});

// for reset after testing only
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await userStore.delete(id);
    res.send("User deleted");
  } catch (error) {
    res.status(422).send(error.message);
  }
});

export default router;
