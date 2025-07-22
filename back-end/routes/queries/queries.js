import express from 'express';
import fs from 'fs';

const router = express.Router();
const fileName = 'queries.json';

// POST /queries — Save list
router.post('/', (req, res) => {
  try {
    const data = JSON.stringify(req.body, null, 2);
    fs.writeFileSync(fileName, data);
    res.status(200).json({ message: "query array saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /queries — Load list
router.get('/', (req, res) => {
  try {
    const rawData = fs.readFileSync(fileName, 'utf-8');
    const data = JSON.parse(rawData);
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ error: "queries.json not found or unreadable" });
  }
});

export default router;
