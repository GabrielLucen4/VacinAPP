import React from 'react';

import './style.css';

function Header() {
  return (
    <div className="container">
      <h1 className="page-header">VacinApp</h1>
      <nav className="navbar">
        <ul>
          <li>Pacientes</li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;