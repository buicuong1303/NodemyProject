const { signPromise } = require('../utils/jwt');
exports.loginLocal = async function (req, res, next) {
  let infoToken = await signPromise({
    user_id: req.user._id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 3),
  });

  if (infoToken.error) return res.json({ error: true, message: token.message });
  res.setHeader('Authorization', infoToken.token);
  return res.json({ error: false, success: true });
};

exports.loginFacebook = async function (req, res) {
  let infoToken = await signPromise({
    facebookId: req.user.userId,
    name: req.name,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 3),
  });

  if (infoToken.error) return res.json({ error: true, message: token.message });
  res.cookie('token', infoToken.token);
  res.redirect('/');
};
