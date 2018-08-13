const nock = require('nock');
const chai = require('chai');
const chaiThings = require('chai-things');
const AlbumsService = require('../../app/services/albums');

const should = chai.should();
chai.use(chaiThings);

describe('AlbumsService', () => {
  describe('all', () => {
    it('Should retrieve a list of albums', done => {
      nock(AlbumsService.URL)
        .get('/albums')
        .reply(200, AlbumsService.ALBUMS_SAMPLE);

      AlbumsService.all()
        .then(albums => {
          albums.should.eql(AlbumsService.ALBUMS_SAMPLE);
          done();
        })
        .catch(err => done(new Error(`Albums not retrieved: ${err.message}`)));
    });

    it('Should not retrieve a list of albums (too many requests)', done => {
      nock(AlbumsService.URL)
        .get('/albums')
        .reply(429);

      AlbumsService.all()
        .then(albums => done(new Error('Successful response - should not be called')))
        .catch(err => {
          err.response.should.have.status(429);
          done();
        });
    });

    it('Should not retrieve a list of albums (something went wrong on server)', done => {
      nock(AlbumsService.URL)
        .get('/albums')
        .reply(500);

      AlbumsService.all()
        .then(albums => done(new Error('Successful response - should not be called')))
        .catch(err => {
          err.response.should.have.status(500);
          done();
        });
    });
  });

  describe('getById', () => {
    const id = 2;
    it(`Should not retrieve an album with id: ${id}`, done => {
      nock(AlbumsService.URL)
        .get(`/albums/${id}`)
        .reply(200, AlbumsService.ALBUM_SAMPLE(id));

      AlbumsService.getById(id)
        .then(albums => {
          albums.should.eql(AlbumsService.ALBUM_SAMPLE(id));
          done();
        })
        .catch(err => done(new Error(`Album not retrieved: ${err.message}`)));
    });
  });
});
