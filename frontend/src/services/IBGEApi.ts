import axios from 'axios';
import { IMunicipio, IUF } from '../schemas/IBGE.schema';

const base = axios.create({
  baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades/'
});

async function getUFs() {
  const ufs: IUF[] = await (await base.get('estados/')).data;

  return ufs;
}

async function getMunicipios(UF: number | string) {
  const municipios: IMunicipio[] = await (await base.get(`/estados/${UF}/municipios`)).data;

  return municipios;
}

export { getMunicipios, getUFs };

