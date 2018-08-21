const JwtService = require('./../services/jwt'),
  User = require('../models').User,
  TokensRepo = require('../services/tokens_repo'),
  errors = require('../errors');

exports.secureFor = roles => {
  return (req, res, next) => {
    const authHeader = req.headers[JwtService.AUTH_HEADER];
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      return JwtService.decode(token)
        .then(json => {
          return TokensRepo.isActive(token).then(active => {
            if (!active) {
              next(errors.notAllowed(new Error('Your token is not active')));
            }
            if (!roles.includes(json.role)) {
              next(errors.notAllowed(new Error('Your role is not allowed')));
            }
            return User.findById(json.id, {
              attributes: {
                exclude: ['password']
              }
            });
          });
        })
        .then(user => {
          if (user) {
            req.user = user;
            next();
          } else {
            next(errors.notAllowed(new Error('You are not on the system')));
          }
        })
        .catch(err => {
          next(errors.notAllowed(err));
        });
    } else {
      res.status(401).json({
        message: `no auth header found: ${JwtService.AUTH_HEADER}`
      });
    }
  };
};
