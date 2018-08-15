'use strict';

const logger = require('../logger');
const errors = require('../errors');

const AlbumsService = require('../services/albums');
const AlbumPurchase = require('../models').AlbumPurchase;

exports.all = (req, res, next) => {
  return AlbumsService.all()
    .then(albums => res.status(200).json(albums))
    .catch(err => {
      logger.log({ level: 'error', message: JSON.stringify(err, null, 2) });
      next(errors.externalApiError(err));
    });
};

exports.buy = (req, res, next) => {
  const albumId = req.params.id;
  return AlbumsService.getById(albumId)
    .then(album => {
      return AlbumPurchase.create({ userId: req.user.id, albumId: album.id })
        .then(purchase => {
          res.status(200).json(purchase);
        })
        .catch(err => {
          logger.log({ level: 'error', message: JSON.stringify(err, null, 2) });
          if (err.name === 'SequelizeUniqueConstraintError') {
            next(errors.forbiddenError(new Error('You cannot buy the same album twice')));
          }
          next(errors.defaultError(err.message));
        });
    })
    .catch(err => {
      logger.log({ level: 'error', message: err });
      if (err.response.status === 404) {
        next(errors.notFound('album'));
      } else {
        next(errors.defaultError(err.message));
      }
    });
};
