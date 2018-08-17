const axios = require('axios');
const config = require('../../config');

exports.URL = config.common.urls.albums;
exports.SAMPLES = require('./samples/album_samples');

exports.all = () => {
  return axios(`${exports.URL}/albums`).then(res => res.data);
};

exports.getById = id => {
  return axios(`${exports.URL}/albums/${id}`).then(res => res.data);
};

exports.getPhotosForAlbumWithId = id => {
  return axios(`${exports.URL}/albums/${id}/photos`).then(res => res.data);
};
