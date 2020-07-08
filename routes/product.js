const express = require('express');
const productRouter = express.Router();
const productController = require('../controllers/product.controller');

productRouter
  .route('/')
  .get(productController.getAllProducts)
  .post(productController.addProduct)
  .delete(productController.deleteProduct);
productRouter.route('/:id').get(productController.getDetail).put(productController.updateProduct);
module.exports = productRouter;
