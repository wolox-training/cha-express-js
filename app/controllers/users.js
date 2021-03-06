'use strict';

const bcrypt = require('bcryptjs');
const logger = require('../logger');
const errors = require('../errors');

const MailerService = require('../services/mailer/mailer');
const JwtService = require('../services/jwt');
const AlbumService = require('../services/albums');

const User = require('../models').User;
const AlbumPurchase = require('../models').AlbumPurchase;

const SignupTemplate = require('../services/mailer/html_templates/signup');
const TokensRepo = require('../services/tokens_repo');

exports.session = (req, res, next) => {
  const creds = req.body || {};

  return User.find({ where: { email: creds.email } }).then(user => {
    if (user) {
      return bcrypt.compare(creds.password, user.password).then(match => {
        if (!match) {
          next(errors.invalidCredentials(new Error('invalid password')));
        } else {
          return JwtService.encode({ id: user.id, role: user.role })
            .then(token => {
              logger.log({ level: 'info', message: 'A session token was given' });
              TokensRepo.store(token.raw.replace('Bearer ', ''))
                .then(() => {
                  res.status(200).json({
                    header: JwtService.AUTH_HEADER,
                    token,
                    userId: user.id
                  });
                })
                .catch(err => {
                  console.log(`DEBUG => ${err}`);
                  logger.log({ level: 'error', message: JSON.stringify(err, null, 2) });
                  next(errors.databaseError(err));
                });
            })
            .catch(err => {
              logger.log({ level: 'error', message: JSON.stringify(err, null, 2) });
              next(errors.invalidCredentials(err));
            });
        }
      });
    }
    next(errors.invalidCredentials(new Error('invalid email')));
  });
};

exports.invalidateSessions = (req, res, next) => {
  return TokensRepo.disableAll()
    .then(() => {
      res.status(200).json();
    })
    .catch(err => next(errors.defaultError(err)));
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
      .catch(err => next(errors.defaultError(err)));
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

exports.boughtAlbums = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (User.canSeeBoughtAlbumsFor(req.user, id)) {
    return AlbumPurchase.findAll({
      where: {
        userId: id
      }
    })
      .then(purchases => {
        const albumsPromises = purchases.map(p => p.albumId).map(albumId => AlbumService.getById(albumId));
        return Promise.all(albumsPromises)
          .then(albums => res.status(200).json(albums))
          .catch(err => {
            logger.log({ level: 'error', message: JSON.stringify(err, null, 2) });
            next(errors.externalApiError(err));
          });
      })
      .catch(err => {
        logger.log({ level: 'error', message: JSON.stringify(err, null, 2) });
        next(errors.databaseError(err));
      });
  } else {
    next(errors.forbiddenError(new Error('You cannot see others albums')));
  }
};

exports.photosBoughtAlbum = (req, res, next) => {
  const albumId = parseInt(req.params.id);
  return AlbumPurchase.findOne({
    where: {
      userId: req.user.id,
      albumId
    }
  })
    .then(purchase => {
      if (purchase) {
        return AlbumService.getPhotosForAlbumWithId(purchase.albumId)
          .then(photos => {
            res.status(200).json(photos);
          })
          .catch(err => {
            logger.log({ level: 'error', message: JSON.stringify(err, null, 2) });
            next(errors.externalApiError(err));
          });
      } else {
        next(errors.notFound(`Album purchase with albumId ${albumId}`));
      }
    })
    .catch(err => {
      logger.log({ level: 'error', message: JSON.stringify(err, null, 2) });
      next(errors.databaseError(err));
    });
};
