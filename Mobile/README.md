# Informações técnicas sobre a parte Mobile

## Validação de campos

### Funcionamento
Cada formulário contém um objeto de estado chamado preenchido.
Como esse:

```
  const [preenchido, setPreenchido] =  useState({
    nome: false,
    cpf: false,
    email: dadosRecebidos.preenchido.email,
    dataNasc: false,
    senha: dadosRecebidos.preenchido.senha,
    confirmarSenha: false
  });
```

Nele é guardado o estado de validação de cada campo, caso o campo esteja preechido e validado de acordo com sua regra, ele será marcado como "true".

Cada campo TextField contém sua função onChangeText que valida o campo a cada caracter for incluído ou retirado do campo.
E a função onBlur que é acionada quando o usuário sai do campo. N qual atualiza o objeto erro, que serve somente para efeito visual, no caso de a informação não estar preenchida de forma correta, o campo ficará vermelho sinalizando o erro.

```
<TextInput
  label="Nome Completo"
  style={styles.input}
  mode="outlined"
  error={erros.nome}
  onChangeText={(nome) => {
    nome = nome.trim();
    setNome(nome);
    validaNome(nome);
  }}
  onBlur={() => {
    setErros({...erros, nome: !preenchido.nome})
  }}
/>
```

A função que cuida da validação do campo, verifica se a regra daquele campo está satisfeita (no caso do exemplo do nome, conter pelo menos um sobrenome).
Caso esteja, ele vai marcar no objeto "preenchido" o campo como "true", ou seja, está preenchido corretamente.
E por fim irá acionar a função validaFormulário, na qual verifica se todos os campos do objeto preenchido estão marcados como "true", para que o botão de enviar o formulário seja liberado.

```
const validaNome = (nome) => {
    if (nome.split(" ").length >= 2) {
      setPreenchido({...preenchido, nome:true})
      validaFormulario({...preenchido, nome: true})
    } else {
      setPreenchido({...preenchido, nome:false})
      validaFormulario({...preenchido, nome: false})
    }
  }
```

 ---

### Regras de validação de cada campo

Agora que vimos como funciona a validação dos campos. Vamos às regras de cada um deles.

#### Formulário de cadastro do paciente:

1. Nome: Deve conter pelo menos um sobrenome. Exemplo: Rodrigo Lins. Somente "Rodrigo" não iria passar.
2. E-mail: é validado pela expressão regular abaixo, na qual identifica o padrão {alguma_coisa}@{alguma_coisa}.{alguma_coisa}
```
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
```
3. CPF: verifica se tem 14 caracteres. (11 números do CPF mais os pontos e o traço - que são colocados automaticamente pelo TextInput).
4. Senha: deve conter pelo menos 5 caractéres.
5. Confirma Senha: deve conter o mesmo valor do campo senha.

---

## Registro de Vacinação

Esse é o principal processo do sistema e o motivo pelo qual ele foi construído. No qual o paciente escaneia o código QR para confirmar e registrar a vacinação na sua carteirinha.

### Como funciona esse processo?

Quando o paciente abre o a tela de escanear o QR Code a primeira vez, é realizado o seguinte processo:
1. Na primeira vez utilizando o aplicativo, o usuário habilitará a permissão do app para utilizar a camera.
2. Feito isso, o paciente irá apontar a camera para o QR Code e o app irá escaneá-lo.
* Código onde está o leitor de QR Code:
```
{
  hasCameraPermission === null
  ? <Text style={{ color: "#FFF" }}>Solicitando permissão de câmera.</Text>
  : hasCameraPermission === false
    ? <Text style={{ color: "#FFF" }}>Permissão de câmera negada!</Text>
    : <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleQrCodeRead}
        style={{
          height: '80%',
          width: '100%',
        }}/>
}
```
* O aplicativo tem uma "chave" chamada **scanned** onde ela marca se o QR Code já foi escaneado ou não. Ela inicia com o valor "false" e quando a função de lidar com o QR Code for chamada (handleQRCode), ela marcará o scanned como "true" para impedir o scanner ler o código mais de uma vez. Essa solução foi implementada por conta da velociade que o scanner tem.
3. Ao escanear, será acionada a função "handleQrCodeRead". Primeiro ela marca o scanned como true, para impedir os múltiplos scans. Depois ela aciona a função cadastraVacinacao para atualizar a flag do banco de dados para concluído. Caso haja algum erro, ou seja, retorne status 400, será mostrado um alerta dizendo que houve um erro ao confirmar a vacinação, o app irá esperar 2 segundos e marcará a flag scanned como "false" novamente, para que seja possível realizar o scan novamente. Caso ocorra tudo bem, a navegação simplesmente voltará à tela principal, agora com a vacina escaneada.
```
const handleQrCodeRead = async (result) => {
  const token = await AsyncStorage.getItem("token");

  setScanned(true);
  cadastraVacinacao(result.data, token).then(status => {
    if (status === 400) {
      Alert.alert("Erro ao confirmar vacinação.");
      setTimeout(() => {
        setScanned(false);
      }, 2000);
    } else {
      navigation.pop();
    }
  }).catch(err => {
    Alert.alert(err);
  })
}
```
4. A função cadastroVacinacao pega os dados lidos no QR Code, faz um split pelo espaço para separar o id do registro de vainação da dose. Exemplo: "123abc456 0" => ["123abc456", "0"]. Depois é montado o payload, no qual faz o decode no token do paciente para extrair seu id. E por fim, é feito um PUT ao Backend para atualizar a flag de concluído para "true".
```
export function cadastraVacinacao(dataQrCode, token) {
  // função que o leitor de QR code chama
  const data = dataQrCode.split(' ');

  const payload = {
    id: data[0],
    dose: data[1],
    paciente: jwt_decode(token)._id
  }

  return axios.put('http://10.0.1.0:4000/api/vacinacao', payload, {headers: { "Authorization": `Bearer ${token}` }})
  .then(response => 200)
  .catch(err => 400);
}
```