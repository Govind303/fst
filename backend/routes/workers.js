

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', auth, role(['assistant']), async (req, res) => {
  try { // Add try-catch block
    const { workerType } = req.query;
    console.log(`Fetching workers with type: ${workerType}`); // Log requested type
    const query = { role: 'worker', workerType, isAvailable: true };
    console.log("Worker query:", query); // Log the database query
    const workers = await User.find(query).select('-password');
    console.log("Found workers:", workers); // Log the result
    res.json(workers);
  } catch (error) { // Catch potential errors
    console.error("Error fetching workers:", error);
    res.status(500).json({ message: "Error fetching workers" });
  }
});

module.exports = router;
