require('../middlewares/passport');
const passport = require('passport');
const express = require('express');
const authenController = require('../controllers/authen.controller');
const authenRouter = express.Router();

authenRouter.post('/local', passport.authenticate('local', { session: false }), authenController.loginLocal);
authenRouter.get('/facebook', passport.authenticate('facebook', { session: false, scope: ['email'] }));
authenRouter.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
  authenController.loginFacebook,
);
module.exports = authenRouter;
