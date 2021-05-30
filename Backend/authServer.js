require("dotenv").config();

const http = require("http");
const express = require("express");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const tipos = ["enfermeiros", "pacientes"];

app.post("/login", (req, res) => {
  const tipo = req.body.tipo;
  const user = req.body.user;

  console.log(req.body);

  if (!tipos.includes(tipo)) {
    return res.status(400).send("Tipo inválido");
  }
  axios
    .post(`http://localhost:4000/api/${tipo}/login`, user)
    .then((response) => {
      const user = response.data[0];
      const accessToken = generateAccessToken(user, tipo);
      res.json({ accessToken });
    })
    .catch((err) => res.sendStatus(403));
});

app.post("/validation", (req, res, next) => {
  const tipo = req.body.tipo;
  const token = req.body.token;

  const secret = tipo === "enfermeiros" ? process.env.ENFERMEIRO_TOKEN_SECRET : process.env.PACIENTE_TOKEN_SECRET

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    res.sendStatus(200);
  });
});

function generateAccessToken(user, tipo) {
  const { senha, __v, cpf, refreshToken, ...userFormatado } = user;
  if (tipo === "enfermeiros") {
    return jwt.sign(userFormatado, process.env.ENFERMEIRO_TOKEN_SECRET, { expiresIn: 57600 });
  } else {
    return jwt.sign(userFormatado, process.env.PACIENTE_TOKEN_SECRET);
  }
}

app.listen(5000, () => console.log("Auth running..."));
