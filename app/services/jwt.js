const jwt = require('jsonwebtoken');
const config = require('./../../config');

const SECRET = config.common.session.jwt_secret; // 'secret'
const JWT_EXPIRE_TIME_SECS = config.common.session.jwt_expire_time_secs; // 60 * 60

exports.AUTH_HEADER = config.common.session.auth_header; // 'auth_token';

exports.encode = toEncode => {
  return new Promise((res, rej) => {
    toEncode.exp = Math.floor(Date.now() / 1000) + JWT_EXPIRE_TIME_SECS;
    jwt.sign(toEncode, SECRET, (err, token) => {
      if (err) {
        rej(err);
      } else {
        res({
          raw: `Bearer ${token}`,
          expireTs: toEncode.exp,
          expiresIn: JWT_EXPIRE_TIME_SECS
        });
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
