import React from 'react';

import { Link } from 'react-router-dom';

import './style.css';


function Header({ alteraTabela }) {
  return (
    <div className="container">
      <h1 className="page-header">VacinApp</h1>
      <nav className="navbar">
        <ul>
          <li><button className="item">Vacinar</button></li>
          <li>
            <Link to="/">
              <button className="item" >Pacientes</button>
            </Link>
          </li>
          <li>
            <Link to="/enfermeiros">
              <button className="item" >Enfermeiros(as)</button>
            </Link>
          </li>
          <li><button className="item">Vacinas</button></li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;