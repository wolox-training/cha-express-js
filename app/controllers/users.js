'use strict';

const bcrypt = require('bcryptjs');
const logger = require('../logger');
const errors = require('../errors');

const MailerService = require('../services/mailer/mailer');
const JwtService = require('../services/jwt');

const User = require('../models').User;

const SignupTemplate = require('../services/mailer/html_templates/signup');

exports.session = (req, res, next) => {
  const creds = req.body || {};

  return User.find({ where: { email: creds.email } }).then(user => {
    if (user) {
      return bcrypt.compare(creds.password, user.password).then(match => {
        if (!match) {
          next(errors.invalidCredentials(new Error('invalid password')));
        }
        return JwtService.encode({ id: user.id, role: user.role })
          .then(token => {
            logger.log({ level: 'info', message: 'A session token was given' });
            res.status(200).json({
              header: JwtService.AUTH_HEADER,
              token: `Bearer ${token}`
            });
          })
          .catch(err => {
            logger.log({ level: 'error', message: JSON.stringify(err, null, 2) });
            next(errors.invalidCredentials(err));
          });
      });
    }
    next(errors.invalidCredentials(new Error('invalid email')));
  });
};

const create = persist => {
  return (req, res, next) => {
    const userObj = req.body || {};
    return bcrypt
      .hash(userObj.password, 10)
      .then(hashedPwd => {
        userObj.password = hashedPwd;
        return persist(userObj)
          .then(createdUser => {
            logger.log({ level: 'info', message: createdUser.firstname });
            MailerService.send(createdUser.email, SignupTemplate.html(createdUser));
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
};

exports.createUser = create(User.createUser);
exports.createAdmin = create(User.createAdmin);

exports.get = (req, res, next) => {
  const id = req.params.id;
  return User.find({
    where: {
      id
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
  const query =
    req.body !== null && Object.keys(req.body).length !== 0 ? req.body : { page_number: 1, page_size: 100 };

  return User.count()
    .then(count => {
      const pagesQuantity = Math.ceil(count / query.page_size);
      const pagesLeft = pagesQuantity - query.page_number;
      const pageOffset = query.page_size * (query.page_number - 1);
      return User.findAll({
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
