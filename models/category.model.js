let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = mongoose.Types.ObjectId;
let { PRODUCT_MODEL } = require('./product.model');
let categorySchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'product',
    },
  ],
});
/**

 */
let CategoryModel = mongoose.model('category', categorySchema);

class Category extends CategoryModel {
  static insert({ title, description }) {
    return new Promise(async (resolve) => {
      try {
        let infoCategory = new Category({
          title,
          description,
        });
        let infoCategoryAfterInsert = await infoCategory.save();
        if (!infoCategoryAfterInsert) return resolve({ error: true, message: 'can not insert category' });
        return resolve({ error: false, data: infoCategoryAfterInsert });
      } catch (error) {
        return resolve({ error: true, message: error.message });
      }
    });
  }
  static getList() {
    return new Promise(async (resolve) => {
      try {
        let listCategories = await Category.find({});
        //Array.isArray(listCategories)
        return resolve({ message: false, data: listCategories });
      } catch (error) {
        return resolve({ error: true, message: error.message });
      }
    });
  }
  static getInfo({ categoryId }) {
    return new Promise(async (resolve) => {
      try {
        if (!ObjectId.isValid(categoryId)) return resolve({ error: true, message: 'Id invalid' });
        let infoCategory = await Category.findById(categoryId);
        if (!infoCategory) return resolve({ error: true, message: 'can not get info' });
        resolve({ error: false, data: infoCategory });
      } catch (error) {
        return resolve({ error: true, message: error.message });
      }
    });
  }
  static delete({ categoryId }) {
    return new Promise(async (resolve) => {
      try {
        if (!ObjectId.isValid(categoryId)) return resolve({ error: true, message: 'Id invalid' });
        let infoCategoryAfterDelete = await Category.findByIdAndDelete(categoryId);
        if (!infoCategoryAfterDelete) return resolve({ error: true, message: 'can not delete category' });
        return resolve({ error: false, data: infoCategoryAfterDelete });
      } catch (error) {
        return resolve({ error: true, message: error.message });
      }
    });
  }
  static update(id, { title, description }) {
    return new Promise(async (resolve) => {
      try {
        if (!ObjectId.isValid(id)) return resolve({ error: true, message: 'Id invalid' });
        let infoCategoryAfterUpdate = await Category.findByIdAndUpdate(
          id,
          {
            $set: {
              title,
              description,
            },
          },
          {
            new: true,
          },
        );
        if (!infoCategoryAfterUpdate) return resolve({ error: true, message: 'Can not update category' });
        return resolve({ error: false, data: infoCategoryAfterUpdate });
      } catch (error) {
        return resolve({ error: true, message: error.message });
      }
    });
  }
  static getAllProductOfCategory(id) {
    return new Promise(async (resolve) => {
      try {
        if (!ObjectId.isValid(id)) return resolve({ error: true, message: 'Id invalid' });

        let infoProducts = await Category.findById(id).populate({
          path: 'products',
          select: 'title description',
        });
        if (!infoProducts) return resolve({ error: true, message: 'can not get product' });
        return resolve({ error: false, data: infoProducts });
      } catch (error) {
        return resolve({ error: true, message: error.message });
      }
    });
  }
}
exports.CATEGORY_MODEL = Category;
