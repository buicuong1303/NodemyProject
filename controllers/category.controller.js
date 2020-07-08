const { CATEGORY_MODEL } = require('../models/category.model');
exports.getAllCategories = async (req, res, next) => {
  let infoCategories = await CATEGORY_MODEL.getList();
  if (infoCategories.error) return next({ message: infoCategories.message });

  return res.json(infoCategories);
};
exports.addCategory = async (req, res, next) => {
  let { title, description } = req.body;
  let infoCategoryAfterInsert = await CATEGORY_MODEL.insert({ title, description });
  if (infoCategoryAfterInsert.error) return next({ message: infoCategoryAfterInsert.message });
  return res.json(infoCategoryAfterInsert);
};

exports.deleteCategory = async (req, res, next) => {
  const { id: categoryId } = req.query;
  let infoCategoryAfterDelete = await CATEGORY_MODEL.delete({ categoryId });
  if (infoCategoryAfterDelete.error) return next({ message: infoCategoryAfterDelete.message });
  return res.json(infoCategoryAfterDelete);
};
exports.getDetail = async (req, res, next) => {
  let { id: categoryId } = req.params;
  let infoCategory = await CATEGORY_MODEL.getInfo({ categoryId });
  if (categoryId.error) return next({ message: infoCategory.message });
  return res.json(infoCategory);
};
exports.updateCategory = async (req, res, next) => {
  let { id } = req.params;
  let { title, description } = req.body;
  let infoCategoryAfterUpdate = await CATEGORY_MODEL.update(id, { title, description });
  if (infoCategoryAfterUpdate.error) return next({ message: infoCategoryAfterUpdate.message });
  return res.json(infoCategoryAfterUpdate);
};

exports.getAllProductOfCategory = async (req, res, next) => {
  let { id } = req.params;

  let infoProducts = await CATEGORY_MODEL.getAllProductOfCategory(id);
  if (infoProducts.error) return next({ message: infoProducts.message });
  return res.json(infoProducts);
};
