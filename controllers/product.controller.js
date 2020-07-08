const { PRODUCT_MODEL } = require('../models/product.model');

exports.getAllProducts = async (req, res, next) => {
  let { data: listProduct } = await PRODUCT_MODEL.getList();

  res.json(listProduct);
};
exports.updateProduct = async (req, res, next) => {
  let { id: productId } = req.params;

  let { title, description, price } = req.body;

  let signalUpdate = null;

  signalUpdate = await PRODUCT_MODEL.update(productId, { title, description, price });

  if (signalUpdate.error) return next({ message: signalUpdate.message });
  return res.json(signalUpdate);
};
exports.deleteProduct = async (req, res, next) => {
  let { id } = req.query;
  let signalDeleteProduct = await PRODUCT_MODEL.delete(id);
  if (signalDeleteProduct.error) next({ message: signalDeleteProduct.message });
  else return res.json(signalDeleteProduct);
};

exports.addProduct = async (req, res, next) => {
  let { title, description, category, price } = req.body;
  let signalInsertProduct = await PRODUCT_MODEL.insert({ title, description, category, price });

  if (signalInsertProduct.error) return next({ message: signalInsertProduct.message });
  return res.json(signalInsertProduct.data);
};
exports.getDetail = async (req, res, next) => {
  let { id: productId } = req.params;

  let infoProduct = await PRODUCT_MODEL.getInfo({ productId });
  if (infoProduct.error) next({ message: infoProduct.message });
  else return res.json(infoProduct);
};
