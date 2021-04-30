import { useState } from 'react';

import Header from './components/Header';
import Table from './components/Table';

import './assets/App.css';

function App() {
  const [tabela, setTabela] = useState('enfermeiros');

  const alteraTabela = (tabela) => {
    setTabela(tabela);
  }

  return (
    <section className="content">
      <Header alteraTabela={alteraTabela}/>
      <Table tabela={tabela}/>
    </section>
  );
}

export default App;
