'use strict';

const bcrypt = require('bcryptjs');
const logger = require('../logger');
const errors = require('../errors');

const JwtService = require('../services/jwt');

const User = require('../models').User;

exports.session = (req, res, next) => {
  const creds = req.body || {};

  return User.find({
    where: {
      email: creds.email
    }
  })
    .then(user => {
      if (user) {
        return bcrypt
          .compare(creds.password, user.password)
          .then(match => {
            if (match) {
              return JwtService.encode({
                id: user.id
              });
            }
            return Promise.reject(new Error('invalid password'));
          })
          .then(token => {
            logger.log({ level: 'info', message: 'A session token was given' });
            res.status(200).json({
              token: `Bearer ${token}`
            });
          })
          .catch(err => {
            logger.log({ level: 'error', message: JSON.stringify(err, null, 2) });
            next(errors.invalidCredentials(err));
          });
      } else {
        return Promise.reject(new Error('invalid email'));
      }
    })
    .catch(err => {
      logger.log({ level: 'error', message: JSON.stringify(err, null, 2) });
      next(errors.invalidCredentials(err));
    });
};

exports.create = (req, res, next) => {
  const userObj = req.body || {};
  bcrypt
    .hash(userObj.password, 10)
    .then(hashedPwd => {
      userObj.password = hashedPwd;
      return User.create(userObj);
    })
    .then(createdUser => {
      logger.log({ level: 'info', message: createdUser.firstname });
      res.status(201).json({
        id: createdUser.id
      });
    })
    .catch(err => {
      logger.log({ level: 'error', message: JSON.stringify(err, null, 2) });
      next(errors.databaseError(err));
    })
    .catch(err => {
      next(errors.defaultError(err));
    });
};

exports.get = (req, res, next) => {
  const anId = req.params.id;
  User.find({
    where: {
      id: anId
    },
    attributes: {
      exclude: ['password']
    }
  })
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        next(errors.notFound('user'));
      }
    })
    .catch(err => {
      logger.log({ level: 'error', message: JSON.stringify(err, null, 2) });
      next(errors.databaseError(err));
    });
};
