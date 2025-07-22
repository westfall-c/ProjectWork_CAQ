import express from 'express';
import { client, connect } from './db.js';

const router = express.Router();
const dbName = 'usersdb';
const collectionName = 'users';

connect(); // Connect to MongoDB

// GET /users
router.get('/', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const prj = { user: 1, email: 1, _id: 0 };
    const users = await collection.find({}).project(prj).toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /users/authenticate
router.post('/authenticate', async (req, res) => {
  try {
    const { user, password } = req.body;
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const record = await collection.findOne({ user });

    if (!record) {
      return res.status(401).json({ message: "user not found" });
    }

    if (record.password !== password) {
      return res.status(401).json({ message: "invalid password" });
    }

    res.status(200).json({ message: "user passed authentication!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
