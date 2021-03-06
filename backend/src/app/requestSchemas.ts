interface IPoint {
  id?: number;
  image: string;
  name: string;
  email: string;
  whatsapp: string;
  lagitude: number;
  longitude: number;
  city: string;
  uf: string;
}

interface IItem {
  id?: number;
  image: string;
  title: string;
  url?: string;
}

interface IPointItems {
  id?: number;
  id_point: number;
  id_item: number;
}

interface IResponseError {
  error?: {
    message: string;
    details: string;
  };
}

export { IPoint, IPointItems, IItem, IResponseError };
