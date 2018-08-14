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
      AlbumPurchase.make(req.user.id, album.id)
        .then(purchase => {
          res.status(200).json(purchase);
        })
        .catch(err => {
          logger.log({ level: 'error', message: JSON.stringify(err, null, 2) });
          next(errors.forbiddenError(err));
        });
    })
    .catch(err => {
      logger.log({ level: 'error', message: err });
      switch (err.response.status) {
        case 404:
          next(errors.notFound('album'));
          break;
        default:
          next(errors.defaultError(err.message));
      }
    });
};
