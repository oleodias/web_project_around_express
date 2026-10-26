const router = require('express').Router();
const fsPromises = require('fs').promises;
const path = require('path');

const cardsPath = path.join(__dirname, '..', 'data', 'cards.json');

router.get('/', (req, res, next) => {
  fsPromises
    .readFile(cardsPath, { encoding: 'utf8' })
    .then((data) => res.send(JSON.parse(data)))
    .catch((error) => next(error));
});

module.exports = router;
