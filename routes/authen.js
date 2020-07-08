require('../middlewares/passport');
const passport = require('passport');
const express = require('express');
const authenController = require('../controllers/authen.controller');
const authenRouter = express.Router();

authenRouter.post('/local', passport.authenticate('local', { session: false }), authenController.loginLocal);

module.exports = authenRouter;
