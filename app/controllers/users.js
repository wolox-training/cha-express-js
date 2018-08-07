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
  }).then(user => {
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
    }
    next(errors.invalidCredentials(new Error('invalid email')));
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

exports.list = (req, res, next) => {
  let query = {
    page_number: 1,
    page_size: 100
  };
  if (req.body !== null && Object.keys(req.body).length !== 0) {
    query = req.body;
  }

  return User.count()
    .then(count => {
      const pagesQuantity = Math.ceil(count / query.page_size);
      const pagesLeft = pagesQuantity - query.page_number;
      const pageOffset = query.page_size * (query.page_number - 1);
      User.findAll({
        attributes: {
          exclude: ['password']
        },
        limit: query.page_size,
        offset: pageOffset,
        $sort: { id: 1 }
      })
        .then(users => {
          res.status(200).json({
            page_number: query.page_number,
            users,
            pages_left: pagesLeft > 0 ? pagesLeft : 0,
            overflow: pagesLeft < 0 && query.page_number > 1
          });
        })
        .catch(err => {
          logger.log({ level: 'error', message: JSON.stringify(err, null, 2) });
          next(errors.databaseError(err));
        });
    })
    .catch(err => {
      logger.log({ level: 'error', message: JSON.stringify(err, null, 2) });
      next(errors.databaseError(err));
    });
};
