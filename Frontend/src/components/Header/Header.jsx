import React from 'react';

import './style.css';

function Header({ alteraTabela }) {
  return (
    <div className="container">
      <h1 className="page-header">VacinApp</h1>
      <nav className="navbar">
        <ul>
          <li><button className="item">Vacinar</button></li>
          <li><button className="item" onClick={()=> { alteraTabela('pacientes') }}>Pacientes</button></li>
          <li><button className="item" onClick={()=> { alteraTabela('enfermeiros') }}>Enfermeiros(as)</button></li>
          <li><button className="item">Vacinas</button></li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;