const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  console.log('Hey it works, still!');
  res.send('Hey! It works, still!');
});

module.exports = router;
