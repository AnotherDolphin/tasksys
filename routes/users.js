import express from 'express';
const router = express.Router();
import UserStore from '../models/user.js';
const store = UserStore;

router.get('/', async (req, res, next) => {
  const users = await store.getAll();  
  res.json(users);
});

router.post('/', async (req, res, next) => {
  const { username } = req.body;
  if (!username) return res.status(400).send('username is required');
  const user = await UserStore.add(username);
  res.send(user);
});

export default router;
