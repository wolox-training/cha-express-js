const JwtService = require('./../services/jwt'),
  User = require('../models').user;

exports.secureFor = roles => {
  return (req, res, next) => {
    const authHeader = req.headers[JwtService.AUTH_HEADER];

    if (authHeader) {
      JwtService.decode(authHeader.replace('Bearer ', ''))
        .then(json => {
          if (!roles.includes(json.role)) {
            return Promise.reject();
          }
          return User.findById(json.id);
        })
        .then(user => {
          if (user) {
            req.client = user;
            next();
          } else {
            res.status(401).json({
              message: `You are not allowed to consume this resource`
            });
          }
        })
        .catch(err => {
          res.status(401).json({
            message: `You are not allowed to consume this resource`
          });
        });
    } else {
      res.status(401).json({
        message: `no header ${JwtService.AUTH_HEADER} found`
      });
    }
  };
};
