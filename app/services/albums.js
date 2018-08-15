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

exports.PHOTOS_FOR_ALBUM_SAMPLE = id => {
  return [
    {
      albumId: id,
      id: 1,
      title: 'accusamus beatae ad facilis cum similique qui sunt',
      url: 'http://placehold.it/600/92c952',
      thumbnailUrl: 'http://placehold.it/150/92c952'
    },
    {
      albumId: id,
      id: 2,
      title: 'reprehenderit est deserunt velit ipsam',
      url: 'http://placehold.it/600/771796',
      thumbnailUrl: 'http://placehold.it/150/771796'
    },
    {
      albumId: id,
      id: 3,
      title: 'officia porro iure quia iusto qui ipsa ut modi',
      url: 'http://placehold.it/600/24f355',
      thumbnailUrl: 'http://placehold.it/150/24f355'
    }
  ];
};

exports.all = () => {
  return axios(`${exports.URL}/albums`).then(res => res.data);
};

exports.getById = id => {
  return axios(`${exports.URL}/albums/${id}`).then(res => res.data);
};

exports.getPhotosForAlbumWithId = id => {
  return axios(`${exports.URL}/albums/${id}/photos`).then(res => res.data);
};
