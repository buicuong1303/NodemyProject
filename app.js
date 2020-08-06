const dotenv = require('dotenv');
dotenv.config();

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
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const { USER_FACEBOOK_MODEL } = require('./models/user-facebook.model');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
const corsOptions = {
  exposedHeaders: 'Authorization',
};
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
// app.use(
//   session({
//     secret: 'conduit',
//     cookie: { maxAge: 60000 },
//     resave: false,
//     saveUninitialized: false,
//   }),
// );
//routes
app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/register', (req, res) => {
  res.render('register');
});
app.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log(req);
  res.render('index', { user: req.user.name, email: req.user.email });
});

app.use('/auth', authenRouter);
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
// passport.serializeUser((user, done) => {
//   done(null, user.userId);
// });
// passport.deserializeUser(async (userId, done) => {
//   let infoUser = await USER_FACEBOOK_MODEL.getInfoUser(userId);
//   if (infoUser.error) done(infoUser.message);
//   console.log('test:' + infoUser.data);
//   done(null, infoUser.data);
// });
module.exports = app;
