const express = require('express');
const router = express.Router();
const Player = require('../models/player');

router.post('/players', async (req, res) => {
  const { name, level, age, plan, startDate, endDate, batchTimings, mobileNumber } = req.body;
  const player = new Player({
    name,
    level,
    age,
    plan,
    startDate,
    endDate,
    batchTimings,
    mobileNumber
  });
  try {
    await player.save();
    res.status(201).json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all players
router.get('/players', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET player by name
router.get('/players/:name', async (req, res) => {
  const { name } = req.params;

  try {
    const player = await Player.findOne({ name });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    res.json(player);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});



module.exports = router;
