import knex from '../../database';
import { Transaction } from 'knex';
import { IPoint, IItem } from '../requestSchemas';
import { Request, Response } from 'express';

interface IPointItems {
  point: IPoint;
  items?: number[];
}

class PointController {
  async index(req: Request, res: Response) {
    const { uf, city, items } = req.query;

    const parsedItems = String(items)
      .split(',')
      .map((item) => item.trim());

    const points: IPoint[] = await knex('points')
      .join('point_items', 'id_point', '=', 'points.id')
      .whereIn('point_items.id_item', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    return res.json(points);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const point: IPoint = await knex('points').select('*').where('id', id).first();

    if (!point) {
      return res.status(404).json({ message: 'Point not found' });
    }

    const items: IItem[] = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.id_item')
      .where('point_items.id_point', id)
      .select('title');

    return res.json({ point, items });
  }

  async store(req: Request, res: Response) {
    const data: IPointItems = req.body;

    const { point: pointData, items } = data;

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
