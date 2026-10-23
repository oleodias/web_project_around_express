const express = require('express');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// Chega aqui só a requisição que nenhuma rota acima atendeu, inclusive a
// raiz: o front-end ainda não está ligado a este servidor.
app.use((req, res) => {
  res.status(404).send({ message: 'A solicitação não foi encontrada' });
});

// Tratador de erros: o Express o reconhece pelos QUATRO parâmetros, por isso
// o next fica na assinatura mesmo sem uso. Sem ele, um endereço malformado
// como /users/%E0 receberia uma página HTML de erro e deixaria o stack no
// console.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  const message = status === 500 ? 'Ocorreu um erro no servidor' : 'Requisição inválida';
  res.status(status).send({ message });
});

// No Express 5, se a porta já estiver ocupada, o erro chega como argumento
// deste callback. Sem o if, a mensagem de "listening" apareceria mesmo com o
// servidor fora do ar.
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`App listening at port ${PORT}`);
});
