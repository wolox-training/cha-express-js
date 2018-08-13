'use strict';

const logger = require('../logger');
const errors = require('../errors');

const AlbumsService = require('../services/albums');

exports.all = (req, res, next) => {
  return AlbumsService.all()
    .then(albums => res.status(200).json(albums))
    .catch(err => {
      logger.log({ level: 'error', message: JSON.stringify(err, null, 2) });
      next(errors.externalApiError(err));
    });
};

exports.buy = (req, res, next) => {
  res.status(200).json({
    id: 1
  });
};
