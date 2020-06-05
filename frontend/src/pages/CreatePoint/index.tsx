import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';

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

  const [selectedLocation, setSelectedLocation] = useState<[number, number]>([0, 0]);
  const [initialLocation, setInitialLocation] = useState<[number, number]>([0, 0]);

  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedUf, setSelectedUf] = useState<string>('');

  const [formData, setFormData] = useState({
    whatsapp: '',
    email: '',
    name: ''
  });

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      setInitialLocation([latitude, longitude]);
    });
  }, []);

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

    setSelectedUf(sigla);

    setMunicipios(await getMunicipios(sigla));
  }

  async function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    if (!city) return;

    setSelectedCity(city);
  }

  function handleSelectLocation(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;

    setSelectedLocation([lat, lng]);
  }

  function handleSelectItem(id: number) {
    const idAlreadyAdded = selectedItems.findIndex((item) => item === id);

    if (idAlreadyAdded !== -1) {
      const ArFilteredItemd = selectedItems.filter((item) => item !== id);

      setSelectedItems(ArFilteredItemd);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  function handleSetFormData(event: ChangeEvent<HTMLInputElement>) {
    const { value, name } = event.target;

    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const [latitude, longitude] = selectedLocation;
    const city = selectedCity;
    const uf = selectedUf;
    const { name, whatsapp, email } = formData; 
    const items = selectedItems;

    const pointData = {
      point: {
        image: 'image fake',
        name,
        whatsapp,
        email,
        city,
        uf,
        latitude,
        longitude,
      },
      items
    }

    await baseAPI.post('/points', pointData);

    alert('Ponto criado com sucesso');
    history.push('/');
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

      <form onSubmit={handleSubmit} action="">
        <h2>
          Cadastro do <br /> ponto de coleta
        </h2>

        <fieldset>
          <legend>Dados</legend>
          <label htmlFor="nome">Nome da entidade</label>
          <input
            onChange={handleSetFormData}
            name="name"
            className="col-10"
            type="text"
            placeholder="Entidade"
          />

          <div className="col-container">
            <div className="col col-5">
              <label htmlFor="endereco">Email</label>
              <input
                onChange={handleSetFormData}
                name="email"
                type="email"
                placeholder="email@email.com"
              />
            </div>
            <div className="col col-4">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                onChange={handleSetFormData}
                name="whatsapp"
                type="text"
                placeholder="82 99999-9999"
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <div className="space-betwen">
            <legend>Endereco</legend>
            <span>Selecione o endereco no mapa</span>
          </div>

          <Map center={initialLocation} zoom={15} onClick={handleSelectLocation}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedLocation} />
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
              <select
                onChange={handleSelectCity}
                disabled={!municipios.length}
                defaultValue="0"
                name=""
                id=""
              >
                <option value="0">Selecione a Cidade</option>
                {municipios.map((municipio) => (
                  <option key={municipio.id} value={municipio.nome}>
                    {municipio.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <div className="space-betwen">
            <legend>Ítens de coleta</legend>
            <span>Selecione um ou mais itens abaixo</span>
          </div>

          <ul className="point-items">
            {items.map((item) => (
              <li
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
                key={item.id}
              >
                <img src={item.url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>
        
        <button className="btn-create" type="submit">Cadastrar novo ponto</button>
      </form>
    </div>
  );
};

export default CreatePoint;
