const router = require('express').Router();

const path = require('path');

router.get('/cards', (req, res) => {
  res.sendFile(path.resolve('data', 'cards.json'));
});

module.exports = router;
