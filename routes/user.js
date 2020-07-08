const express = require('express');
const userController = require('../controllers/user.controller');

const user_router = express.Router();

user_router.route('/').post(userController.createUser);
module.exports = user_router;
