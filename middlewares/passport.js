const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const auth = require('../config/keys');
const { ExtractJwt } = require('passport-jwt');
const FacebookStrategy = require('passport-facebook').Strategy;
const { USER_MODEL } = require('../models/user.model');
const { USER_FACEBOOK_MODEL } = require('../models/user-facebook.model');
const isValidPassword = async function (user, password) {
  return await bcrypt.compare(password, user.password);
};
var cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies['token'];
  }
  return token;
};
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: auth.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const { facebookId: userId } = payload;
        if (userId) {
          const userFb = await USER_FACEBOOK_MODEL.getInfoUser(userId);
          if (userFb.data) return done(null, userFb.data);
        }
        const user = await USER_MODEL.findById(payload.user_id);
        if (!user) return done(null, false);
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    },
  ),
);

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    const user = await USER_MODEL.findOne({ email: email });
    if (!user) {
      return done(null, false);
    }
    const checkPass = await isValidPassword(user, password);
    if (!checkPass) {
      return done(null, false);
    }
    return done(null, user);
  }),
);
passport.use(
  new FacebookStrategy(
    {
      clientID: auth.CLIENT_ID,
      clientSecret: auth.FB_SECRET,
      callbackURL: 'https://localhost:8080/auth/facebook/callback',
      profileFields: ['emails', 'displayName'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { name, email, id: userId } = profile._json;

        let isExist = await USER_FACEBOOK_MODEL.getInfoUser(userId);

        if (isExist.error) {
          let user = await USER_FACEBOOK_MODEL.insert({ email, name, userId });
          if (user.error) return done(user.message);

          return done(null, user.data);
        }
        return done(null, isExist.data);
      } catch (error) {}
    },
  ),
);
