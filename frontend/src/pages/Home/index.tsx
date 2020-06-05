import React from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiLogIn } from "react-icons/fi";

import "./styles.css";

import logo from "../../assets/logo.svg";

const pages: React.FC = () => {
  return (
    <div id="home-container">
      <header id="home-header">
        <img src={logo} alt="logo Ecoleta" />

        <Link className="link" to="/create-point">
          <FiLogIn />
          <p>Cadastre um ponto de coleta</p>
        </Link>
      </header>

      <div id="home-content">
        <div id="content-text">
          <strong>Seu marketplace de coleta de resíduos</strong>
          <p>
            Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente
          </p>

          <Link className="link btn" to="/">
            <div className="icon">
              <FiSearch />
            </div>
            <p>Pesquisar pontos de coleta</p>
          </Link>
        </div>
        <div id="background-content" />
      </div>
    </div>
  );
};

export default pages;
