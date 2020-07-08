const express = require('express');
const categoryRouter = express.Router();
const categoryController = require('../controllers/category.controller');
const { route } = require('./product');

categoryRouter
  .route('/')
  .get(categoryController.getAllCategories)
  .post(categoryController.addCategory)
  .delete(categoryController.deleteCategory);
categoryRouter.route('/all-product-of-category/:id').get(categoryController.getAllProductOfCategory);
categoryRouter.route('/:id').get(categoryController.getDetail).put(categoryController.updateCategory);
module.exports = categoryRouter;
