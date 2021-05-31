# Informações técnicas sobre a parte Web

## Validação de campos

### Funcionamento
Cada formulário contém um objeto de estado chamado preenchido.
Como esse:

```
  const [preenchido, setPreenchido] =  useState({
    nome: {value: false, message: ""},
    email: {value: false, message: ""},
    coren: {value: false, message: ""},
    senha: {value: false, message: ""},
    confirmarSenha: {value: false, message: ""}
  });
```

Nele é guardado o estado e o texto de ajuda caso haja algum erro.

Cada campo TextField contém sua função onChange que valida o campo a cada caracter for incluído ou retirado do campo.
E a função onBlur que é acionada quando o usuário sai do campo. Nela, é validado o campo uma última vez passando o texto de ajuda - helperText - para caso o campo esteja preenchido incorretamente. E aciona o objeto erro, que serve somente para efeito visual, que caso a informação não esteja preenchida de forma correta, o campo ficará vermelho sinalizando o erro.

```
<TextField
  label="Nome"
  id="nome"
  helperText={preenchido.nome.message}
  variant="outlined"
  margin="normal"
  error={erros.nome}
  InputProps={{ className: classes.input }}
  onChange={(event) => {
    let nome = event.target.value.trim();
    setNome(nome);
    validaNome(nome);
  }}
  onBlur={() => {
    validaNome(nome, "É necessário pelo menos um sobrenome.")
    setErros({...erros, nome: !preenchido.nome.value})
  }}
/>
```

A função que cuida da validação do campo, verifica se a regra daquele campo está satisfeita (no caso do exemplo do nome, conter pelo menos um sobrenome).
Caso esteja, ele vai marcar no objeto "preenchido" o campo como "true", ou seja, está preenchido corretamente.
E por fim irá acionar a função validaFormulário, na qual verifica se todos os campos do objeto preenchido estão marcados como "true", para que o botão de enviar o formulário seja liberado.

```
const validaNome = (nome, message="") => {
    // * nome deve conter pelo menos um sobrenome
    if (nome.split(" ").length >= 2) {
      setPreenchido({...preenchido, nome: {value: true, message: ""}})
      validaFormulario({...preenchido, nome: {value: true, message: ""}})
    } else {
      setPreenchido({...preenchido, nome: {value: false, message }})
      validaFormulario({...preenchido, nome: {value: false, message}})
    }
  }
```

**Nota**: Como o helperText (argumento message na função de validar) é passado somente na função onBlur, o mesmo só aparecerá caso o usuário saia do campo e ele esteja errado.

 ---

### Regras de validação de cada campo

Agora que vimos como funciona a validação dos campos. Vamos às regras de cada um deles.

#### Formulário de cadastro de enfermeiro:

1. Nome: Deve conter pelo menos um sobrenome. Exemplo: Rodrigo Lins. Somente "Rodrigo" não iria passar.
2. E-mail: é validado pela expressão regular abaixo, na qual identifica o padrão {alguma_coisa}@{alguma_coisa}.{alguma_coisa}
```
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
```
3. COREN: é válidado pela expressão regular abaixo, na qual identifica o seguinte padrão para o coren: {3 números}.{3 números}.{3 números}-{2 letras}
4. Senha: deve conter pelo menos 5 caractéres.
5. Confirma Senha: deve conter o mesmo valor do campo senha.

#### Formulário de cadastro da vacina:

1. Doença: Não pode estar vazio.
2. Fabricante: Não pode estar vazio.
3. Lote: Não pode estar vazio.
4. Quantidade: Não pode ter uma quantidade menor ou igual a 0.
5. Prazo Máxio Entre Doses: Não pode ser menor ou igual a 0.
6. Tempo Limite de Proteção: Não pode ser menor ou igual a 0.

#### Formulário de registro de vacinação:
1. Vacina: deve existir no banco de dados.
2. Paciente: deve existir no banco de dados.
3. Data de retorno: é validada pela seguinte expressão regular abaixo, na qual identifica o seguinte padrão: {2 números}/{2 números}/{4 números}.*
```
/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
```
*Apesar da validação desse campo conter menos critérios do que deveria, esse campo irá sumir em futuras atualizações. Na qual a data de retorno será calculada automaticamente pelo sistema.

---

## Registro de Vacinação

Esse é o principal processo do sistema e o motivo pelo qual ele foi construído. No qual é responsável por gerar o código QR para que o paciente possa confirmar a vacinação escaneando-o pelo aplicativo do VacinApp.

### Como funciona esse processo?

Quando o enfermeiro clica no botão vacinar, é feito o seguinte processo:
1. O sistema pega as informações do formulário e os formata para fazer a chamada ao Backend:
```
const payload = {
    paciente: paciente._id,
    doenca: vacina.doenca,
    doses: vacina.dose,
    vacina: {
      fabricante: vacina.fabricante,
      lote: vacina.lote,
      enfermeiroNome: enfermeiroInfo.nome,
      enfermeiroCoren: enfermeiroInfo.coren,
      concluido: false,
    },
    dataRetorno: dataRetorno,
    prazoMaximoEntreDoses: vacina.prazoMaximoEntreDoses,
    tempoTotalProtecao: vacina.tempoTotalProtecao
  }
```
* Esse campo **concluido** é inicialmente marcado como "false", para sinalizar que a vacinação ainda não foi confirmada pelo paciente.

2. O Backend poderá retornar as seguintes respostas:
* Caso a vacinação seja registrada com sucesso, será retornada a mensagem do backend, o id da vacinação e a dose que foi aplicada:
```
{
  mensagem: "Vacinação registrada",
  id: 123abc456,
  dose: 0
}
```
* Caso dê algum erro durante o registro da vacinação, será retornada somente a mensagem:
```
{
  mensagem: "Dose não aplicada, pois é de fabricante diferente da dose anteriror"
}
```

3. A função de gerar o QR Code recebe a resposta do backend e configura as informações do QR code, que é "{id da vacinação} {dose}" e a mensagem. Caso haja erro, ou seja, só retorne a mensagem, as informações do QR code serão colocodas como uma string vazia. Por fim, marca o modal como "true" para que ele possa aparecer e exibir as informações.
```
const geraQrCode = () => {
    console.log("Chamando")
    // cadastra vacinação no banco
    cadastraVacinacao(vacina, paciente, dataRetorno, token).then(response => {
      // verifica se a resposta tem o id da vacinação
      if ('id' in response) {
        // * caso tenha, ele coloca a mensagem e as informações para gerar o QR Code
        setMessage(response.mensagem);
        setQRCodeInfo(`${response.id} ${response.dose}`);
      } else {
        // ! caso não tenha, ele só coloca a mensagem e não gera o QR Code
        setMessage(response.mensagem);
        setQRCodeInfo("");
      }
      setModalIsOpen(true);
    })
  }
```

4. No modal só será exibido o QR code caso ele receba as informações do banco de dados:
```
<Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={{
  overlay: {
    zIndex: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.45)'
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    width: 500,
    height: 500,
    alignItems:"center",
    margin: 'auto',
  }
}}>
  <h2>{message}</h2>
  {
  qrCodeInfo &&
    <QRCode
      value={qrCodeInfo}
      size={450}
      level={"H"}
      includeMargin={true}/>
  }
</Modal>
```

**Nota**: O QR code é gerado pela biblioteca "react-qr-code".
