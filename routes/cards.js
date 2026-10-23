const router = require('express').Router();
const fsPromises = require('fs').promises;
const path = require('path');

const cardsPath = path.join(__dirname, '..', 'data', 'cards.json');

router.get('/', (req, res) => {
  fsPromises
    .readFile(cardsPath, { encoding: 'utf8' })
    .then((data) => res.send(JSON.parse(data)))
    .catch(() => res.status(500).send({ message: 'Ocorreu um erro no servidor' }));
});

module.exports = router;
