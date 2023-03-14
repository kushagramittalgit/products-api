import { Request, Response } from 'express';
import { Error } from 'mongoose';
import { validate } from 'uuid';

import { ProductDatabase } from '../database.mongo';

const getListHandler = async (req: Request, res: Response) => {
  const { page = 1, size = 3 } = req.query;
  try {
    const result = await ProductDatabase.getProducts(
      typeof page === 'number' ? page : Number(page),
      typeof size === 'number' ? size : Number(size)
    );

    if (result) {
      res.send({
        pageNumber: result.currentPage,
        pageSize: typeof size === 'number' ? size : Number(size),
        pageItemCount: result.data.length,
        totalItemCount: result.total,
        items: result.data,
      });
    } else {
      res.status(400).send({ error: 'incorrect request' });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (ex: any) {
    console.log(ex.message);
    res.status(500).send({ error: ex.message });
  }
};

const getProductByIDHandler = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (id && validate(id)) {
    const product = await ProductDatabase.getProductByID(id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ error: 'not able to find the product with the provided id' });
    }
  } else {
    res.status(400).send({ error: 'invalid product id is provided' });
  }
};

export { getListHandler, getProductByIDHandler };
