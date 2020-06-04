import knex from '../../database';
import { IItem } from '../requestSchemas';
import { Request, Response } from 'express';

class ItemController {
  async index(req: Request, res: Response) {
    const items: IItem[] = await knex('items').select('*');
    const { HOST, PORT } = process.env;

    const itemsSerialized = items.map((item) => ({
      ...item,
      url: `http://${HOST}:${PORT}/uploads/${item.image}`,
    }));

    return res.json(itemsSerialized);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const [item] = await knex('items').select('*').where('id', id);

    return res.json(item);
  }

  async store(req: Request, res: Response) {
    const data: IItem = req.body;

    await knex('items').insert(data);

    return res.send();
  }
}

export default new ItemController();
