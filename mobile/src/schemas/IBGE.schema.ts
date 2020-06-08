interface IUF {
  id:	number;
  nome: string;
  sigla: string;

  regiao: {
    id: number;
    nome: string;
    sigla: string;
  }
}

interface IMunicipio {
  id:	number;
  nome: string;

  microregiao: {
    id: number;
    nome: string;
    mesorregiao: {}
  }
}

export type { IMunicipio, IUF }
