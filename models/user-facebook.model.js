let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let bcrypt = require('bcryptjs');
let SALT_WORK_FACTOR = 10;

let userFacebookSchema = new Schema({
  email: {
    type: String,

    trim: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

let UserFacebookModel = mongoose.model('userFacebook', userFacebookSchema);

class UserFacebook extends UserFacebookModel {
  static insert({ email, name, userId }) {
    return new Promise(async (resolve) => {
      let infoUser = new UserFacebook({ email, name, userId });
      let infoUserAfterInsert = await infoUser.save();
      if (!infoUserAfterInsert) return resolve({ error: true, message: 'can not create user' });
      return resolve({ error: false, data: infoUserAfterInsert });
    });
  }
  static getInfoUser(userId) {
    return new Promise(async (resolve) => {
      try {
        let infoUser = await UserFacebook.findOne({ userId });
        if (!infoUser) return resolve({ error: true, message: 'can not get user' });
        return resolve({ error: false, data: infoUser });
      } catch (error) {
        return resolve({ error: true, message: 'can not get user' });
      }
    });
  }
}
exports.USER_FACEBOOK_MODEL = UserFacebook;
