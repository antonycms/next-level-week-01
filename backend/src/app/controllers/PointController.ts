import knex from '../../database';
import { Transaction } from 'knex';
import { IPoint } from '../requestSchemas';
import { Request, Response } from 'express';

interface IPointItems {
  point: IPoint;
  items?: number[];
}

class PointController {
  async index(req: Request, res: Response) {
    const points: IPoint[] = await knex('points').select('*');

    return res.json(points);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const [point]: IPoint[] = await knex('points').select('*').where('id', id);

    return res.json(point);
  }

  async store(req: Request, res: Response) {
    const data: IPointItems = req.body;

    const pointData = data.point;
    const items = data.items;

    let trx: Transaction;

    try {
      trx = await knex.transaction();
      const [id_point]: number[] = await trx('points').insert(pointData);

      if (items && items.length) {
        const pointItems = items.map((id_item) => ({
          id_item,
          id_point,
        }));

        await trx('point_items').insert(pointItems);
      }

      await trx.commit();

      return res.send();
    } catch (error) {
      if (trx) await trx.commit();
      const responseError = { details: error.message, message: 'Internal Server Error' };

      return res.status(500).json(responseError);
    }
  }
}

export default new PointController();
