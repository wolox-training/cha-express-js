const jwt = require('jsonwebtoken');

const SECRET = 'secret'; // should go on env variable

exports.HEADER_NAME = 'auth_token'; // should go on env variable

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
