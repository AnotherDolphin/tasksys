import { Router } from "express";
import UserStore from "../models/user.js";

const router = Router();

router.get("/", async (req, res, next) => {
  const users = await UserStore.getAll();
  res.json(users);
});

router.post("/", async (req, res, next) => {
  const { username } = req.body;
  if (!username) return res.status(400).send("username is required");
  const user = await UserStore.add(username);
  res.send(user);
});

export default router;
