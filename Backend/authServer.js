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
  // pega o tipo de login
  const tipo = req.body.tipo;
  // pega o objeto de usuário com suas credenciais
  const user = req.body.user;

  console.log(req.body);

  // se o tipo não existir será retornado um erro dizendo que o tipo é inválido
  if (!tipos.includes(tipo)) {
    return res.status(400).send("Tipo inválido");
  }

  // será feito uma requisição de login de acordo com a api do tipo
  axios
    .post(`http://localhost:4000/api/${tipo}/login`, user)
    .then((response) => {
      // na resposta será retornado o usuário, caso ele exista e as credenciais estejam corretas
      // caso não exista ou esteja incorreta,
      // o catch mandará o status 403 (forbidden)
      const user = response.data;

      // será gerado um token de acordo com o tipo e com os dados do usuário
      const accessToken = generateAccessToken(user, tipo);
      res.json({ accessToken });
    })
    .catch((err) => res.sendStatus(403));
});

app.post("/validation", (req, res, next) => {
  // na validação será pego o tipo também e o token
  const tipo = req.body.tipo;
  const token = req.body.token;

  // será escolhido o segredo de acordo com o tipo passado
  const secret = tipo === "enfermeiros" ? process.env.ENFERMEIRO_TOKEN_SECRET : process.env.PACIENTE_TOKEN_SECRET

  // e por fim, a validação será feita
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    res.sendStatus(200);
  });
});

function generateAccessToken(user, tipo) {
  // será removido informações sensíveis ou não necessárias do usúario, como senha, cpf e __v
  const { senha, __v, cpf, ...userFormatado } = user;
  if (tipo === "enfermeiros") {
    // caso seja enfermeiro, será gerado um token jwt com o segredo do enfermeiro, e esse terá
    // uma validade de 16 horas
    return jwt.sign(userFormatado, process.env.ENFERMEIRO_TOKEN_SECRET, { expiresIn: 57600 });
  } else {
    // caso seja paciente, será gerado um token jwt com o segredo do paciente e será vitalício.
    return jwt.sign(userFormatado, process.env.PACIENTE_TOKEN_SECRET);
  }
}

app.listen(5000, () => console.log("Auth running..."));
