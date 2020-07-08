let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = mongoose.Types.ObjectId;
const { CATEGORY_MODEL } = require('./category.model');
let productSchema = new Schema({
  //_id
  title: { type: String, require: true },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'category',
  },
  description: String,
  price: Number,
  image: String,
});
let ProductModel = mongoose.model('product', productSchema);

class Product extends ProductModel {
  static insert({ title, description, category, price }) {
    return new Promise(async (resolve) => {
      try {
        let inforProduct = new Product({ title, description, category, price });

        if (!ObjectId.isValid(category)) return resolve({ error: true, message: 'Id invalid' });
        let isExistCategory = await CATEGORY_MODEL.findById(category);
        if (!isExistCategory) return resolve({ error: true, message: 'category not exist' });
        if (Number.isNaN(Number(price))) return resolve({ error: true, message: 'param_invalid_price' });

        let signalAfterInsert = await inforProduct.save();
        if (!signalAfterInsert) return resolve({ error: true, message: 'can not insert' });
        let { _id: productID } = signalAfterInsert;
        let infoCategoryAfterUpdate = await CATEGORY_MODEL.findByIdAndUpdate(category, {
          $push: {
            products: productID,
          },
        });
        if (!infoCategoryAfterUpdate) return resolve({ error: true, message: 'can not update category' });
        return resolve({ error: false, data: signalAfterInsert });
      } catch (error) {
        return resolve({ error: true, message: error.message });
      }
    });
  }
  static getInfo({ productId }) {
    return new Promise(async (resolve) => {
      try {
        console.log(productId);
        if (!ObjectId.isValid(productId)) return resolve({ error: true, message: 'Id invalid' });
        let inforProduct = await Product.findById(productId);
        if (!inforProduct) return resolve({ error: true, message: 'can not get info' });
        resolve({ error: false, data: inforProduct });
      } catch (error) {
        return resolve({ error: true, message: error.message });
      }
    });
  }
  static getList() {
    return new Promise(async (resolve) => {
      try {
        let listProduct = await Product.find({}).populate('category', 'title');
        //Array.isArray(listProduct)
        return resolve({ message: false, data: listProduct });
      } catch (error) {
        return resolve({ error: true, message: error.message });
      }
    });
  }
  static delete(id) {
    return new Promise(async (resolve) => {
      try {
        if (!ObjectId.isValid(id)) return resolve({ error: true, message: 'Id invalid' });

        let infoProductToAfterDelete = await Product.findByIdAndDelete(id);
        if (!infoProductToAfterDelete) return resolve({ error: true, message: 'can not delete product' });
        let infoCategoryAfterUpdate = await CATEGORY_MODEL.findByIdAndUpdate(infoProductToAfterDelete.category, {
          $pull: {
            products: id,
          },
        });
        if (!infoCategoryAfterUpdate) return resolve({ error: true, message: 'can not update category' });
        return resolve({ error: false, data: infoProductToAfterDelete });
      } catch (error) {
        return resolve({ error: true, message: error.message });
      }
    });
  }
  static update(id, { title, description, price }) {
    return new Promise(async (resolve) => {
      try {
        let infoProductAfterUpdate = null;
        infoProductAfterUpdate = await Product.findByIdAndUpdate(
          id,
          {
            $set: {
              title,
              description,
              price,
            },
          },
          {
            new: true,
          },
        );

        if (!infoProductAfterUpdate) return resolve({ error: true, message: 'can not update product' });

        return resolve({ error: false, data: infoProductAfterUpdate });
      } catch (error) {
        return resolve({ error: true, message: error.message });
      }
    });
  }
}
exports.PRODUCT_MODEL = Product;
