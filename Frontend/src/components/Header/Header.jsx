import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import StoreContext from '../Store/Context';
import { tokenValidation } from "../../controllers/token";

import "./style.css";

function Header({ alteraTabela }) {
  const { token } = useContext(StoreContext);
  const [valido, setValido] = useState(false);

  useEffect(() => {
    const accessAllowed = () => {
      return tokenValidation(token).then(status => {
        if (status === 200) {
          setValido(true);
        } else {
          setValido(false);
        }
      })
    }
    accessAllowed();
  }, [token]);

  const header = () => {

    if (valido) {
      return (
        <div className="container">
          <h1 className="page-header">VacinApp</h1>
          <nav className="navbar">
            <ul>
              <li>
                <Link to="/vacinacao/cadastrar">
                  <button className="item">Vacinar</button>
                </Link>
              </li>
              <li>
                <Link to="/pacientes">
                  <button className="item">Pacientes</button>
                </Link>
              </li>
              <li>
                <Link to="/enfermeiros">
                  <button className="item">Enfermeiros(as)</button>
                </Link>
              </li>
              <li>
                <Link to="/vacinas">
                  <button className="item">Vacinas</button>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      );
    } else {
      return;
    }
  };
  return (
    <>
      {header()}
    </>
  );
}

export default Header;
