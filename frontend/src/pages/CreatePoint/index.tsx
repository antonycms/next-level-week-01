import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer } from 'react-leaflet';

import { getMunicipios, getUFs } from '../../services/IBGEApi';
import { baseAPI } from '../../services/appApi';

import { IItem } from '../../schemas/appApi.schema';
import { IUF, IMunicipio } from '../../schemas/IBGE.schema';

import './styles.css';
import logo from '../../assets/logo.svg';

const CreatePoint: React.FC = () => {
  const [items, setItems] = useState<IItem[]>([]);
  const [municipios, setMunicipios] = useState<IMunicipio[]>([]);
  const [ufs, setUfs] = useState<IUF[]>([]);

  useEffect(() => {
    getUFs().then((ufs) => setUfs(ufs));
  }, []);

  useEffect(() => {
    baseAPI.get('items').then((response) => {
      const items: IItem[] = response.data;

      setItems(items);
    });
  }, []);

  async function handleSelectUF(event: ChangeEvent<HTMLSelectElement>) {
    const sigla = event.target.value;
    if (!sigla) return;

    setMunicipios(await getMunicipios(sigla));
  }

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

          <Map center={[-10.1246393, -36.1653911]} zoom={15}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </Map>

          <div className="col-container">
            <div className="col col-4">
              <label htmlFor="name">Estado (UF)</label>
              <select defaultValue="0" onChange={handleSelectUF} name="" id="">
                <option disabled value="0">
                  Selecione o Estado (UF)
                </option>
                {ufs.map((uf) => (
                  <option key={uf.id} value={uf.sigla}>
                    {uf.nome} ({uf.sigla})
                  </option>
                ))}
              </select>
            </div>

            <div className="col col-5">
              <label htmlFor="endereco">Cidade</label>
              <select disabled={!municipios.length} defaultValue="0" name="" id="">
                <option value="0">Selecione a Cidade</option>
                {municipios.map((municipio) => (
                  <option key={municipio.id} value={municipio.nome}>
                    {municipio.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label htmlFor="name">Nome da entidade</label>
          <input className="col-10" type="text" placeholder="ex: entidade" />
        </fieldset>

        <fieldset>
          <div className="space-betwen">
            <legend>Ítens de coleta</legend>
            <span>Selecione um ou mais itens abaixo</span>
          </div>

          <ul className="point-items">
            {items.map((item) => (
              <li key={item.id}>
                <img src={item.url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>
      </form>
    </div>
  );
};

export default CreatePoint;
