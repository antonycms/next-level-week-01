import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import './styles.css';
import logo from '../../assets/logo.svg';

const CreatePoint: React.FC = () => {
  return (
    <div id="create-container">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          <span>Voltar para Home</span>
        </Link>
      </header>

      <form action="">
        <h2>
          Cadastro do <br /> ponto de coleta
        </h2>

        <fieldset>
          <legend>Dados</legend>
          <label htmlFor="nome">Nome da entidade</label>
          <input className="col-10" type="text" placeholder="Entidade" />

          <div className="col-container">
            <div className="col col-5">
              <label htmlFor="endereco">Email</label>
              <input type="email" placeholder="email@email.com" />
            </div>
            <div className="col col-4">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" placeholder="82 99999-9999" />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <div className="space-betwen">
            <legend>Endereco</legend>
            <span>Selecione o endereco no mapa</span>
          </div>
          <div className="col-container">
            <div className="col col-4">
              <label htmlFor="name">Estado (UF)</label>
              <select name="" id="">
                <option value="0">Selecione o Estado (UF)</option>
              </select>
            </div>

            <div className="col col-5">
              <label htmlFor="endereco">Cidade</label>
              <select name="" id="">
                <option value="0">Selecione a Cidade</option>
              </select>
            </div>
          </div>

          <label htmlFor="name">Nome da entidade</label>
          <input className="col-10" type="text" placeholder="ex: entidade" />
        </fieldset>
      </form>
    </div>
  );
};

export default CreatePoint;
