const jwt = require('jsonwebtoken');
const config = require('./../../config');

const SECRET = config.common.session.jwt_secret; // 'secret'

exports.AUTH_HEADER = config.common.session.auth_header; // 'auth_token';

exports.encode = toEncode => {
  return new Promise((res, rej) => {
    jwt.sign(toEncode, SECRET, (err, token) => {
      if (err) {
        rej(err);
      } else {
        res(token);
      }
    });
  });
};

exports.decode = toDecode => {
  return new Promise((res, rej) => {
    jwt.verify(toDecode, SECRET, (err, decoded) => {
      if (err) {
        rej(err);
      } else {
        res(decoded);
      }
    });
  });
};
