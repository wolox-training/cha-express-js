'use strict';

const bcrypt = require('bcryptjs');
const logger = require('../logger');
const errors = require('../errors');

const JwtService = require('../services/jwt');

const User = require('../models').User;

exports.session = (req, res, next) => {
  const creds = req.body || {};

  const userPromise = User.find({
    where: {
      email: creds.email
    }
  });

  const matchPromise = userPromise.then(user => {
    if (user !== null) {
      return bcrypt.compare(creds.password, user.password);
    }
    throw new Error('invalid email');
  });

  Promise.all([userPromise, matchPromise])
    .then(([user, match]) => {
      if (match) {
        return JwtService.encode({
          id: user.id
        });
      }
      throw new Error('invalid password');
    })
    .then(token => {
      res.status(200).json({
        token: `Bearer ${token}`
      });
    })
    .catch(err => {
      next(errors.invalidCreds(err));
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
