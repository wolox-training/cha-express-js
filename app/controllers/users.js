'use strict';

const bcrypt = require('bcryptjs');
const logger = require('../logger');
const User = require('../models').User;

exports.create = (req, res, next) => {
  const userObj = req.body || {};
  if (User.isPwdLengthGreater(userObj, 8)) {
    bcrypt.hash(userObj.password, 10).then(hashedPwd => {
      userObj.password = hashedPwd;
      User.createModel(userObj)
        .then(createdUser => {
          logger.log({
            level: 'info',
            message: createdUser.firstname
          });
          res.status(201).send();
        })
        .catch(err => {
          if (err.name === 'SequelizeValidationError') {
            res.status(400).json({
              errors: err.errors
            });
          }
          logger.log({
            level: 'error',
            message: JSON.stringify(err.errors, null, 2)
          });
          res.status(500).send();
        });
    });
  } else {
    const someErrors = [
      {
        error: 'password should be greater than or equal to 8 characters'
      }
    ];
    logger.log({
      level: 'error',
      message: JSON.stringify(someErrors, null, 2)
    });
    res.status(400).json({
      errors: someErrors
    });
  }
};
