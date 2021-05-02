import Header from "./components/Header";
import Table from "./components/Table";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./assets/App.css";
import CadastroEnfermeiro from "./components/CadastroEnfermeiro";

function App() {
  return (
    <section className="content">
      <Router>
        <Header/>
        <Switch>
          <Route exact path="/">
            <Table tabela="pacientes" />
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
          <Route path="*">
            <h2>404</h2>
          </Route>
        </Switch>
      </Router>
    </section>
  );
}

export default App;
