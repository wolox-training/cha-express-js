const JwtService = require('./../services/jwt'),
  User = require('../models').User;

exports.secureFor = roles => {
  return (req, res, next) => {
    const authHeader = req.headers[JwtService.AUTH_HEADER];

    if (authHeader) {
      JwtService.decode(authHeader.replace('Bearer ', ''))
        .then(json => {
          if (!(roles.indexOf(json.role) > -1)) {
            return Promise.reject(new Error('Your role is not allowed'));
          }
          return User.findById(json.id, {
            attributes: {
              exclude: ['password']
            }
          });
        })
        .then(user => {
          if (user) {
            req.client = user;
            next();
          } else {
            res.status(401).json({
              message: `You are not allowed to consume this resource: You are not on the system`
            });
          }
        })
        .catch(err => {
          res.status(401).json({
            message: `Your are not allowed to consume this resource: ${err.message}`
          });
        });
    } else {
      res.status(401).json({
        message: `no auth header found: ${JwtService.AUTH_HEADER}`
      });
    }
  };
};
