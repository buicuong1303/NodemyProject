const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { JWT_SECRET } = require('../config/keys');
const { ExtractJwt } = require('passport-jwt');
const { USER_MODEL } = require('../models/user.model');
const isValidPassword = async function (user, password) {
  return await bcrypt.compare(password, user.password);
};
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
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
