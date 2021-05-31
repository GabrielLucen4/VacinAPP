# Informações técnicas sobre o Backend

O Backend é divido em dois servidores, um que cuida da autenticação dos usuários (authServer). E outro que cuida das demais requisições (server).

## Autenticação

A autenticação tanto dos pacientes quanto dos enfermeiros é feita ambas pelo mesmo link: http://{IP_do_auth_server}:5000/login.

O que difere na hora do processamento é o campo "tipo" no corpo da chamada:
```
{
    "tipo": "enfermeiros",
    "user": {
        "coren": "103.445.234-SP",
        "senha": "rodrigo"
    }
}
```
ou
```
{
    "tipo": "pacientes",
    "user": {
        "email": "rodrigo@email.com",
        "senha": "rodrigo"
    }
}
```

O programa irá receber a chamada, pegar o tipo e o user e irá verificar se é um tipo válido. Caso não seja, será retornado como "Tipo inválido". Caso esteja tudo ok com o tipo, ele fará uma requisição de login ao server dependendo do tipo requisitado e esperará os dados do usuário como resposta. Caso seja retornado algum erro, ele retornará 403 (proibido).
Com os dados do usuário ele irá gerar um token a partir da função generateAccesToken e o retornará ao requisitante:

```
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
```

O generateAccesToken irá gerar um token utilizando o segredo de acordo com o tipo. Primeiro será removida as informações sensíveis do token, como senha e cpf, e informações desnecessárias como o __v. Caso seja do tipo infermeiro, o token terá uma validade de 16 horas (57600 segundos).
```
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
```

## Registro de Vacinações
### Como é feito?

Quando o backend recebe da parte Web uma chamada para registrar uma vacinação, ele faz as seguintes verificações:
1. Verifica se o paciente já tem uma vacinação registrada daquela doença. Caso não tenha, é criada uma nova. Caso tenha, é seguida as validações.
2. Seguindo as validações, agora o programa irá verificar se o paciente confirmou a dose anterior (escaneou o código QR). Caso não o tenha feito, será pega as informações da vacinação que ficou pendente e será gerado o código QR com elas. Caso esteja conluída, segue as verificações.
3. Logo após, será verificado se a vacinação está dentro da quantidade de doses que a vacina necessita. Ou seja, se a vacina tem duas doses, a pessoa não pode estar tomando a terceira. Caso não esteja dentro, será verificado se a vacina ainda está dentro do limite de proteção, caso esteja, será retornado que a vacinação já está concluida. Caso o limite de proteção tenha expirado, as doses serão resetadas como se fosse uma vacinação nova. Mas caso ainda esteja dentro das doses, as validações continuarão.
4. Estando dentro das doses, ele irá verificar se a data de hoje é uma data depois da data de retorno. Caso não seja, não será autorizada a vacinação e será retornada a mensagem: "Vacinação não permitida, pois está antes da data de retorno.". Caso esteja tudo ok, o dia de hoje é uma data depois da de retorno, ele continuará com as verificações.
5. Após verificar a data de retorno, ele irá verificar se a data de hoje é antes da data máxima entre as dose. Caso não esteja, o paciente terá que tomar todas as doses novamente e as doses serão restadas. Caso esteja, será feita uma última validação.
6. A última validação é verificar se a fabricante da vacina tomada na dose anterior é a mesma da atual. Caso sim, será adicionado uma nova dose ao registro de vacinação. Caso contrário, a vacinação não será permitida e será enviada a mensagem: "Vacinação não permitida, pois a vacinação ainda está no prazo e são vacinas de fabricantes diferentes."

Fluxograma dessas verificações: [Fluxograma](https://lucid.app/lucidchart/invitations/accept/inv_3815cc42-f3ef-4a60-931c-4158ad847dc6?viewport_loc=554%2C1373%2C2994%2C1574%2C0_0)