const axios = require('axios');
const config = require('../../config');

exports.URL = config.common.urls.albums;
exports.ALBUMS_SAMPLE = [
  {
    userId: 1,
    id: 1,
    title: 'quidem molestiae enim'
  },
  {
    userId: 1,
    id: 2,
    title: 'sunt qui excepturi placeat culpa'
  },
  {
    userId: 2,
    id: 3,
    title: 'omnis laborum odio'
  },
  {
    userId: 2,
    id: 4,
    title: 'non esse culpa molestiae omnis sed optio'
  }
];

exports.ALBUM_SAMPLE = id => exports.ALBUMS_SAMPLE[id - 1];

exports.all = () => {
  return axios(`${exports.URL}/albums`).then(res => res.data);
};

exports.getById = id => {
  return axios(`${exports.URL}/albums/${id}`).then(res => res.data);
};
