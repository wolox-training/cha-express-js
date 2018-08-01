'use strict';

const User = require('../models').User;

exports.create = (req, res, next) => {
  const userObj = req.body || {};
  User.isPwdLengthGreater(userObj, 8)
    .then(() => {
      User.createModel(userObj)
        .then(createdUser => {
          res.status(201).send();
        })
        .catch(err => {
          if (err.name === 'SequelizeValidationError') {
            res.status(400).json({
              errors: err.errors
            });
          }
          res.status(500).send();
        });
    })
    .catch(() => {
      res.status(400).json({
        errors: [
          {
            error: 'password should be greater than or equal to 8 characters'
          }
        ]
      });
    });
};
