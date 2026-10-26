# 🌍 Around The U.S. — API REST com MongoDB

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
