'use strict';
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');

const signPromise = (objData) => {
  return new Promise((resolve) => {
    try {
      jwt.sign(objData, JWT_SECRET, (err, token) => {
        if (err) resolve({ error: true, message: err.message });
        resolve({ error: false, token });
      });
    } catch (error) {
      return resolve({ error: true, message: err.message });
    }
  });
};
const verifyPromise = (token) => {
  return new Promise((resolve) => {
    try {
      jwt.verify(token, JWT_SECRET, (err, data) => {
        if (err) return resolve({ error: true, message: err.message });
        return resolve({ error: false, data });
      });
    } catch (error) {
      return resolve({ error: true, message: error.message });
    }
  });
};

module.exports = {
  signPromise,
  verifyPromise,
};
