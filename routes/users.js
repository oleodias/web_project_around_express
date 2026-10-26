const router = require('express').Router();
const fsPromises = require('fs').promises;
const path = require('path');

// __dirname é a pasta routes/; o arquivo está em ../data. O path.join monta o
// caminho com o separador certo em qualquer sistema operacional.
const usersPath = path.join(__dirname, '..', 'data', 'users.json');

// Lê o arquivo a cada requisição: o conteúdo pode mudar sem reiniciar o
// servidor. Um arquivo ilegível ou um JSON quebrado rejeitam a promessa e
// caem no catch de quem chamou.
function readUsers() {
  return fsPromises
    .readFile(usersPath, { encoding: 'utf8' })
    .then((data) => JSON.parse(data));
}

// O catch não responde: passa o erro ao tratador central do app.js, que
// monta a resposta 500. Assim a mensagem de erro fica num lugar só.
router.get('/', (req, res, next) => {
  readUsers()
    .then((users) => res.send(users))
    .catch((error) => next(error));
});

router.get('/:id', (req, res, next) => {
  readUsers()
    .then((users) => {
      // Procura pelo _id. Usar o parâmetro como índice do array deixaria
      // passar /users/length e /users/__proto__.
      const user = users.find((item) => item._id === req.params.id);

      if (!user) {
        res.status(404).send({ message: 'ID do usuário não encontrado' });
        return;
      }

      res.send(user);
    })
    .catch((error) => next(error));
});

module.exports = router;
