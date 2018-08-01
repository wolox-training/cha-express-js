'use strict';

const bcrypt = require('bcryptjs');
const logger = require('../logger');
const errors = require('../errors');

const User = require('../models').User;

exports.create = (req, res, next) => {
  const userObj = req.body || {};
  bcrypt
    .hash(userObj.password, 10)
    .then(hashedPwd => {
      userObj.password = hashedPwd;
      User.createModel(userObj)
        .then(createdUser => {
          logger.log({ level: 'info', message: createdUser.firstname });
          res.status(201).json({
            id: createdUser.id
          });
        })
        .catch(err => {
          logger.log({ level: 'error', message: JSON.stringify(err, null, 2) });
          next(errors.databaseError(err));
        });
    })
    .catch(err => {
      next(errors.defaultError(err));
    });
};
