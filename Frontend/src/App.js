import Header from "./components/Header";
import Login from "./components/Login";
import Table from "./components/Table";
import CadastroEnfermeiro from "./components/CadastroEnfermeiro";
import CadastroVacina from './components/CadastroVacina';
import CadastroVacinacao from './components/CadastroVacinacao';
import StoreProvider from './components/Store/Provider';


import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./assets/App.css";

function App() {
  return (
    <section className="content">
      <Router>
        <StoreProvider>
          <Header/>
          <Switch>
            <Route exact path="/">
              <Login />
            </Route>
            <Route exact path="/pacientes">
              <Table tabela="pacientes" />
            </Route>
            <Route exact path="/enfermeiros">
              <Table tabela="enfermeiros" />
            </Route>
            <Route path="/enfermeiros/cadastrar">
              <CadastroEnfermeiro />
            </Route>
            <Route exact path="/vacinas">
              <Table tabela="vacinas"/>
            </Route>
            <Route path="/vacinas/cadastrar">
              <CadastroVacina />
            </Route>
            <Route path="/vacinacao/cadastrar">
              <CadastroVacinacao />
            </Route>
            <Route path="*">
              <h2>404</h2>
            </Route>
          </Switch>
        </StoreProvider>
      </Router>
    </section>
  );
}

export default App;
