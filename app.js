const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const app = express();
const productRouter = require('./routes/product');
const categoryRouter = require('./routes/category');
const userRouter = require('./routes/user');
const authenRouter = require('./routes/authen');
const passport = require('passport');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
const corsOptions = {
  exposedHeaders: 'Authorization',
};
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes
app.use('/authen', authenRouter);
app.use('/users', userRouter);
app.use('/products', passport.authenticate('jwt', { session: false }), productRouter);
app.use('/categories', passport.authenticate('jwt', { session: false }), categoryRouter);
app.use((err, req, res, next) => {
  const error = app.get('env') === 'development' ? err : {};
  const status = err.status || 500;
  console.log(error);
  return res.status(status).json({
    error: true,
    message: error.message,
  });
});
app.use(function (req, res) {
  res.status(404).send('not found');
});
module.exports = app;
