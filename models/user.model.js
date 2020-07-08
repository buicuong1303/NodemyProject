let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let bcrypt = require('bcryptjs');
let SALT_WORK_FACTOR = 10;

let userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
userSchema.pre('save', async function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  const passwordHashed = await bcrypt.hash(user.password, salt);
  user.password = passwordHashed;
  next();
});
let UserModel = mongoose.model('user', userSchema);

class User extends UserModel {
  static insert({ email, password }) {
    return new Promise(async (resolve) => {
      let infoUser = new User({ email, password });
      let infoUserAfterInsert = await infoUser.save();
      if (!infoUserAfterInsert) return resolve({ error: true, message: 'can not create user' });
      return resolve({ error: false, data: infoUserAfterInsert });
    });
  }
  static getInfoUser() {
    let infoUsers = User.find({});
    if (!infoUsers) return resolve({ error: true, message: 'can not get user' });
    return resolve({ error: false, infoUser });
  }
}
exports.USER_MODEL = User;
