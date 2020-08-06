const { USER_MODEL } = require('../models/user.model');

exports.createUser = async (req, res, next) => {
  let { email, password } = req.body;
  let infoUserAfterCreate = await USER_MODEL.insert({ email, password });
  if (infoUserAfterCreate.error) return next({ message: infoUserAfterCreate.message });
  return res.redirect('/login');
};
