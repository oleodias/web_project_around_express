# 🌍 Around The U.S. — API REST com MongoDB

## 📅 Sprints

Projeto das **Sprints 15 e 16** do curso de Desenvolvimento Web da TripleTen
Brasil. É o back-end do projeto cujo front-end está em
[`web_project_around_pt`](https://github.com/oleodias/web_project_around_pt)
(Sprints 8 a 12) e
[`web_project_around_react`](https://github.com/oleodias/web_project_around_react)
(Sprints 13 e 14).

| Sprint | O que foi feito neste repositório |
| --- | --- |
| 15 | servidor Express com as rotas `/users`, `/users/:id` e `/cards` lendo arquivos JSON, ESLint e nodemon |
| 16 | API REST com MongoDB: modelos no Mongoose, dez rotas, curtidas e erros 400 / 404 / 500 |

---

## 📝 Descrição do Projeto

**Around The U.S.** é a galeria de lugares construída nas Sprints 8 a 14 do
curso de Desenvolvimento Web da TripleTen Brasil. Este repositório é o
**back-end** do projeto: uma API REST em Node.js e Express, com os usuários e
os cartões guardados no **MongoDB**.

Na Sprint 15, os dados vinham de arquivos JSON. Agora vêm do banco `aroundb`:
dá para criar usuários e cartões, editar o perfil e o avatar, curtir,
descurtir e excluir cartões.

A autorização ainda é **temporária**: um middleware no `app.js` faz todas as
requisições agirem como um usuário de teste. A autenticação de verdade vem na
próxima sprint.

### Resumo

- **O que foi construído e por quê:** o back-end do projeto Around, com dez
  rotas REST separadas em rotas, controladores e modelos do Mongoose, para que
  o front-end leia e grave dados num banco de verdade em vez de arquivos JSON.
- **Problema que resolve:** cria, consulta, edita e exclui usuários e cartões
  com dados validados (tamanhos, campos obrigatórios e regex de URL), impede
  curtidas duplicadas (`$addToSet` / `$pull`) e responde sempre com o status
  certo (400, 404, 500) a partir de um único tratador de erros.
- **Tecnologias:** Node.js, Express 5, MongoDB com Mongoose 8, ESLint (Airbnb),
  EditorConfig e nodemon.

---

## 🎬 Demonstração em vídeo

> 🔗 **Vídeo:** _link a adicionar depois da publicação_

Vídeo de **2min36** (1080p, 60 fps, legendas em português) com o código deste
repositório, **sem alterações**, rodando com `npm run start` e ligado a um
**MongoDB 8.0** local (banco `aroundb`). Todas as respostas, os status e o
estado do banco que aparecem na tela são reais.

| Capítulo | O que aparece | Onde está no código |
| --- | --- | --- |
| 01 · Servidor no ar | `npm run start` e a conexão com o MongoDB (log real) | `app.js` |
| 02 · Usuários | `GET /users`, `POST /users` (201) e `GET /users/:userId` | `routes/users.js`, `controllers/users.js` |
| 03 · Perfil | `PATCH /users/me` e `/users/me/avatar` | `{ new: true, runValidators: true }` |
| 04 · Cartões | `POST /cards` com o `owner` vindo da autorização, `GET /cards` | `controllers/cards.js` |
| 05 · Curtidas | curtir duas vezes continua com 1 curtida; descurtir | `$addToSet` e `$pull` |
| 06 · Excluir | `DELETE /cards/:cardId` esvazia a coleção | `findByIdAndDelete` + `orFail()` |
| 07 · Erros | id malformado, id inexistente, link inválido, JSON malformado e rota inexistente | tratador central no `app.js` |

**Como o vídeo foi feito:** a API não tem interface, então as requisições são
feitas por um **console de testes criado só para a demo** (uma página local,
fora deste repositório, que repassa cada requisição sem alterações para a API e
mostra a resposta e o estado das coleções). O vídeo marca esse console como
ilustração. O usuário de teste foi criado direto no banco com o `_id` fixo do
middleware temporário, sem alterar o `app.js`. A tela é uma gravação real do
navegador (Playwright); por cima dela há só uma camada de *motion* (câmera,
cursor, setas, destaques, legendas e capítulos), feita com Python, Cairo e
ffmpeg.

**Trilha sonora:** original, composta e sintetizada por código para o vídeo
(sem samples nem músicas de terceiros). É um lo-fi a 92 BPM sincronizado com as
animações: a batida entra quando o console ocupa a tela, cada capítulo tem uma
transição sonora e cada destaque toca uma nota do acorde.

---

## 🚩 Rotas

| Requisição | O que faz | Sucesso |
| --- | --- | --- |
| `GET /users` | todos os usuários | `200` |
| `GET /users/:userId` | um usuário pelo `_id` | `200` |
| `POST /users` | cria um usuário (`name`, `about`, `avatar`) | `201` |
| `PATCH /users/me` | atualiza `name` e `about` | `200` |
| `PATCH /users/me/avatar` | atualiza o `avatar` | `200` |
| `GET /cards` | todos os cartões | `200` |
| `POST /cards` | cria um cartão (`name`, `link`); o `owner` é o usuário atual | `201` |
| `DELETE /cards/:cardId` | exclui um cartão | `200` |
| `PUT /cards/:cardId/likes` | curte | `200` |
| `DELETE /cards/:cardId/likes` | descurte | `200` |

### Erros

Toda resposta de erro tem só o campo `message`.

| Status | Quando | `message` |
| --- | --- | --- |
| `400` | dados que não passam no esquema | `Dados inválidos` |
| `400` | id malformado (`/users/abc`) | `ID inválido` |
| `400` | JSON ou endereço malformado | `Requisição inválida` |
| `404` | usuário ou cartão inexistente | `Usuário não encontrado` / `Cartão não encontrado` |
| `404` | endereço que não existe | `A solicitação não foi encontrada` |
| `500` | qualquer outro erro | `Ocorreu um erro no servidor` |

---

## 🛠 Tecnologias e técnicas

- **Node.js**, **Express 5** e **MongoDB** com o **Mongoose 8**
- Código dividido em **modelos** (`models/`), **controladores**
  (`controllers/`) e **rotas** (`routes/`)
- **Esquemas com validação**: tamanhos, campos obrigatórios e uma
  **expressão regular** para os links (`utils/validators.js`). Os updates usam
  `{ new: true, runValidators: true }`, para devolver o documento atualizado e
  validar também na edição
- **Relacionamentos**: o `owner` e as `likes` do cartão guardam `ObjectId`s de
  usuários
- **Curtidas sem repetição** com os operadores `$addToSet` e `$pull`
- **Tratamento de erros centralizado**: os controladores passam os erros com
  `next(err)`, e um único tratador no `app.js` escolhe o status pelo tipo
  (`CastError`, `ValidationError`, `NotFoundError`). Os status ficam em
  constantes (`utils/errors.js`), e o `orFail()` transforma "não encontrado" em
  erro 404
- **ESLint 8.56** com o guia **Airbnb**, **EditorConfig** e **nodemon**

---

## 📐 Estrutura do Projeto

```
├── controllers/
│   ├── cards.js
│   └── users.js
├── models/
│   ├── card.js
│   └── user.js
├── routes/
│   ├── cards.js
│   └── users.js
├── utils/
│   ├── errors.js          ← status em constantes e o NotFoundError
│   └── validators.js      ← a regex de URL
├── .editorconfig
├── .eslintrc
├── app.js                 ← conexão, middlewares, rotas e tratador de erros
└── package.json
```

---

## 💻 Como executar localmente

É preciso ter o **MongoDB** rodando em `mongodb://localhost:27017`. O banco
`aroundb` é criado sozinho na primeira gravação.

```bash
npm install
npm run start   # servidor em http://localhost:3000
npm run dev     # o mesmo, reiniciando a cada arquivo salvo
npm run lint    # ESLint
```

Para testar, crie um usuário com `POST /users` no Postman, coloque o `_id`
dele no middleware temporário do `app.js` e crie os cartões com
`POST /cards`.

---

## 📈 Próximos passos

1. Cadastro, login e autenticação com JWT, no lugar do usuário de teste
2. Só o dono poder excluir o próprio cartão
3. Ligar o front-end em React a esta API

---

## 👤 Autor

**Leonardo Dias Caumo** — _Desenvolvido como parte do portfólio de estudos em Desenvolvimento Web da TripleTen Brasil._
