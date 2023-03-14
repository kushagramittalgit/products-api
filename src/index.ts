import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';

import {
  createProduct,
  deleteProductHandler,
  getListHandler,
  getProductByIDHandler,
  updatePriceHandler,
  updateStockHandler,
  updateStockValidator,
  updatePriceValidator,
} from './products';

const app = express();
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(cors({  }));
app.route('/products').get(getListHandler).post(createProduct);
app.route('/products/:id').get(getProductByIDHandler).delete(deleteProductHandler);

app.put('/products/:id/stock', [updateStockValidator], updateStockHandler);
app.put('/products/:id/price', [updatePriceValidator], updatePriceHandler);

app.use('/**', (req, res) => {
  res.status(404).send({ error: 'resource not found' });
});

app.listen(PORT, () => {
  console.log(`Products APIs are running on port ${PORT}`);
});
