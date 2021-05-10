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

app.post("/token", (req, res) => {
  const tipo = req.body.tipo;
  const refreshToken = req.body.token;

  if (!tipos.includes(tipo)) {
    return res.status(400).send("Tipo inválido");
  }
  if (refreshToken == null) {
    return res.sendStatus(401);
  }

  axios
    .get(`http://localhost:4000/api/${tipo}/token/${refreshToken}`)
    .then((response) => {
      if (response.data.length < 0) {
        return res.sendStatus(403);
      }

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, user) => {
          if (err) return res.sendStatus(403);
          const accessToken = generateAccessToken(user);
          res.status(200).json({ accessToken });
        }
      );
    });
});

app.post("/login", (req, res) => {
  const tipo = req.body.tipo;
  const user = req.body.user;

  if (!tipos.includes(tipo)) {
    return res.status(400).send("Tipo inválido");
  }
  axios
    .post(`http://localhost:4000/api/${tipo}/login`, user)
    .then((response) => {
      const user = response.data[0];
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

      axios
        .patch(
          `http://localhost:4000/api/${tipo}/token`,
          { _id: user._id, refreshToken: refreshToken },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        .then((response) => {
          res.json({ accessToken, refreshToken });
        })
        .catch((err) => {
          res.send(err);
        });
    })
    .catch((err) => res.sendStatus(403));
});

app.post("/validation", (req, res, next) => {
  jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    res.sendStatus(200);
  });
});

app.delete("/logout", (req, res) => {
  // remove refresh token
});

function generateAccessToken(user) {
  const { senha, coren, __v, cpf, refreshToken, ...usert } = user;
  return jwt.sign(usert, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "50m" });
}

app.listen(5000, () => console.log("Auth running..."));
