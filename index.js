const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
const PORT = 3000;

app.use(express.json());

let alunos = [
  { id: 1, nome: "João", curso: "ADS" },
  { id: 2, nome: "Maria", curso: "Engenharia" }
];

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Alunos",
      version: "1.0.0",
      description: "API CRUD de alunos"
    },
    servers: [{ url: "http://localhost:3000" }]
  },
  apis: ["./index.js"]
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /alunos:
 *   get:
 *     summary: Lista todos os alunos
 */
app.get("/alunos", (req, res) => {
  res.json(alunos);
});

/**
 * @swagger
 * /alunos/{id}:
 *   get:
 *     summary: Busca aluno por ID
 */
app.get("/alunos/:id", (req, res) => {
  const aluno = alunos.find(a => a.id == req.params.id);
  if (!aluno) return res.status(404).json({ erro: "Aluno não encontrado" });
  res.json(aluno);
});

/**
 * @swagger
 * /alunos:
 *   post:
 *     summary: Cria um aluno
 */
app.post("/alunos", (req, res) => {
  const { nome, curso } = req.body;
  const novo = {
    id: alunos.length ? alunos[alunos.length - 1].id + 1 : 1,
    nome,
    curso
  };
  alunos.push(novo);
  res.status(201).json(novo);
});

/**
 * @swagger
 * /alunos/{id}:
 *   put:
 *     summary: Atualiza aluno
 */
app.put("/alunos/:id", (req, res) => {
  const aluno = alunos.find(a => a.id == req.params.id);
  if (!aluno) return res.status(404).json({ erro: "Aluno não encontrado" });

  const { nome, curso } = req.body;
  if (nome) aluno.nome = nome;
  if (curso) aluno.curso = curso;

  res.json(aluno);
});

/**
 * @swagger
 * /alunos/{id}:
 *   delete:
 *     summary: Remove aluno
 */
app.delete("/alunos/:id", (req, res) => {
  const index = alunos.findIndex(a => a.id == req.params.id);
  if (index === -1) return res.status(404).json({ erro: "Aluno não encontrado" });

  alunos.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
