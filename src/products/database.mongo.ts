import { Common } from '../common';
import { ProductModel, Products } from './models';

const getProducts = async (page: number, size: number) => {
  if (page < 1) page = 1;
  return Common.Mongo.getConnection().then(async () => {
    const total = await Products.collection.estimatedDocumentCount();
    const skip = (page - 1) * size;
    if (page === 1 || skip < total) {
      const data = await Products.find<ProductModel>({}, {}, { skip: (page - 1) * size, limit: size });
      return { data, total, currentPage: page };
    } else {
      const extraItems = (total % size) > 0;
      const totalPages = Math.floor(total / size) + (extraItems ? 1 : 0);
      const data = await Products.find<ProductModel>({}, {}, { skip: (totalPages - 1) * size, limit: size });
      return { data, total, currentPage: totalPages };
    }
  });
};

const getProductByID = async (id: string) => {
  return Common.Mongo.getConnection().then(async () => {
    const data = await Products.findById(id);
    console.log(data);
    return data;
  });
};

const deleteProduct = async (id: string) => {
  return Common.Mongo.getConnection().then(async () => {
    const data = await Products.findByIdAndRemove(id);
    return data;
  });
};

const updateProductStock = async (id: string, stock: number) => {
  return Common.Mongo.getConnection().then(async () => {
    const data = await Products.findByIdAndUpdate(id, { $set: { stock } });
    return data;
  });
};

const updateProductPrice = async (id: string, price: number) => {
  return Common.Mongo.getConnection().then(async () => {
    const data = await Products.findByIdAndUpdate(id, { $set: { price } });
    return data;
  });
};

const createProduct = async (product: ProductModel) => {
  return Common.Mongo.getConnection()
    .then(async () => {
      const newProduct = new Products(product);
      return newProduct.save().then((doc) => {
        return doc._id;
      });
    })
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        return null;
      }
    });
};

export const ProductDatabase = {
  getProducts,
  getProductByID,
  createProduct,
  deleteProduct,
  updateProductPrice,
  updateProductStock,
};
