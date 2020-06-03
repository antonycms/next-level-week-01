import knex from '../../database';
import { IPoint, IResponseError } from '../requestSchemas';
import { Request, Response } from 'express';

interface IPointItems {
  point: IPoint;
  items?: number[];
}

class PointController {
  async index(req: Request, res: Response) {
    const { id } = req.params;
    let points: IPoint[] | IPoint;

    if (id) {
      points = await knex('points').select('*').where('id', id);
    } else {
      points = await knex('points').select('*');
    }

    return res.json(points);
  }

  async store(req: Request, res: Response) {
    const data: IPointItems = req.body;

    const pointData = data.point;
    const items = data.items;

    try {
      const trx = await knex.transaction();

      const [point]: IPoint[] = await trx('points').insert(pointData);

      if (items && items.length) {
        const pointItems = items.map((id_item) => ({
          id_item,
          id_point: point.id,
        }));

        await trx('point_items').insert(pointItems);
      }

      return res.send();
    } catch (err) {
      const responseError: IResponseError = {
        error: {
          details: err.message,
          message: 'Internal Server Error',
        },
      };

      return res.status(500).json(responseError);
    }
    //
  }
}

export default new PointController();
