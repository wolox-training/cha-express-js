const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiThings = require('chai-things');
const dictum = require('dictum.js');

const should = chai.should();
chai.use(chaiThings);

chai.use(chaiHttp);
const server = require('../../app');

const request = chai.request(server);
const UserRequests = require('../helpers/user_requests');

describe('AlbumsController', () => {
  describe('GET /albums', () => {
    it('Should not retrieve a list of albums, if not logged', done => {
      request
        .get('/albums')
        .then(res => done(new Error('Successful response - This should not be called')))
        .catch(err => {
          err.should.have.status(401);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.message.should.include('no auth header found:');
          done();
        });
    });

    it('Should retrieve a list of albums, if logged as user', done => {
      UserRequests.signInAsDefaultUser().then(session => {
        request
          .get('/albums')
          .set(session.header, session.token.raw)
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.an('array');
            res.body.should.all.have.property('id');
            res.body.should.all.have.property('userId');
            res.body.should.all.have.property('title');
            done();
          })
          .catch(err => done(new Error(`Albums not retrieved: ${err.message}`)));
      });
    });

    it('Should retrieve a list of albums, if logged as admin', done => {
      UserRequests.signInAsDefaultAdmin().then(session => {
        request
          .get('/albums')
          .set(session.header, session.token.raw)
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.an('array');
            res.body.should.all.have.property('id');
            res.body.should.all.have.property('userId');
            res.body.should.all.have.property('title');
            done();
          })
          .catch(err => done(new Error(`Albums not retrieved: ${err.message}`)));
      });
    });
  });

  describe('POST /albums/:id', () => {
    const albumId = 1;
    it('Should not buy an album, if not logged', done => {
      request
        .post(`/albums/${albumId}`)
        .then(res => done(new Error('Successful response - This should not be called')))
        .catch(err => {
          err.should.have.status(401);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.message.should.include('no auth header found:');
          done();
        });
    });

    it('Should buy an album, if logged as user', done => {
      UserRequests.signInAsDefaultUser().then(session => {
        request
          .post(`/albums/${albumId}`)
          .set(session.header, session.token.raw)
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('id');
            res.body.id.should.be.a('number');
            done();
          })
          .catch(err => done(new Error(`Album not purchase: ${err.message}`)));
      });
    });

    it('Should buy an album, if logged as admin', done => {
      UserRequests.signInAsDefaultAdmin().then(session => {
        request
          .post(`/albums/${albumId}`)
          .set(session.header, session.token.raw)
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('id');
            res.body.id.should.be.a('number');
            done();
          })
          .catch(err => done(new Error(`Album not purchase: ${err.message}`)));
      });
    });

    it('Should not buy an album twice, if logged as user', done => {
      UserRequests.signInAsDefaultUser().then(session => {
        request
          .post(`/albums/${albumId}`)
          .set(session.header, session.token.raw)
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('id');
            res.body.id.should.be.a('number');
            request
              .post(`/albums/${albumId}`)
              .set(session.header, session.token.raw)
              .then(resTwo => done(new Error('Successful response - This should not be called')))
              .catch(err => {
                err.should.have.status(403);
                err.response.should.be.json;
                err.response.body.should.have.property('message');
                err.response.body.message.should.be.a('string');
                err.response.body.message.should.include('You cannot buy the same album twice');
                done();
              });
          })
          .catch(err => done(new Error(`Album not purchase: ${err.message}`)));
      });
    });

    it('Should not buy an album twice, if logged as admin', done => {
      UserRequests.signInAsDefaultAdmin().then(session => {
        request
          .post(`/albums/${albumId}`)
          .set(session.header, session.token.raw)
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('id');
            res.body.id.should.be.a('number');
            request
              .post(`/albums/${albumId}`)
              .set(session.header, session.token.raw)
              .then(resTwo => done(new Error('Successful response - This should not be called')))
              .catch(err => {
                err.should.have.status(403);
                err.response.should.be.json;
                err.response.body.should.have.property('message');
                err.response.body.message.should.be.a('string');
                err.response.body.message.should.include('You cannot buy the same album twice');
                done();
              });
          })
          .catch(err => done(new Error(`Album not purchase: ${err.message}`)));
      });
    });

    it('Should not buy an album, if not found', done => {
      UserRequests.signInAsDefaultAdmin().then(session => {
        request
          .post(`/albums/-1`)
          .set(session.header, session.token.raw)
          .then(res => done(new Error('Successful response - This should not be called')))
          .catch(err => {
            err.should.have.status(404);
            err.response.should.be.json;
            err.response.body.should.have.property('message');
            err.response.body.message.should.be.a('string');
            err.response.body.message.should.equal('album not found');
            done();
          });
      });
    });
  });

  describe('GET /users/:user_id/albums', () => {
    it('Should not retrive bought albums from user, if not logged', done => {
      request
        .get(`/users/10/albums`)
        .then(res => done(new Error('Successful response - This should not be called')))
        .catch(err => {
          err.should.have.status(401);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.message.should.be.a('string');
          err.response.body.message.should.include('no auth header found:');
          done();
        });
    });

    it('Should retrieve bought albums from user, if logged as admin', done => {
      UserRequests.signInAsDefaultAdmin().then(session => {
        request
          .get(`/users/${session.userId + 1}/albums`)
          .set(session.header, session.token.raw)
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.an('array');
            done();
          })
          .catch(err => done(new Error(`Bought albums not retrieved: ${err.message}`)));
      });
    });

    it('Should retrieve its bought albums, if logged as user', done => {
      UserRequests.signInAsDefaultUser().then(session => {
        request
          .get(`/users/${session.userId}/albums`)
          .set(session.header, session.token.raw)
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.an('array');
            done();
          })
          .catch(err => done(new Error(`Bought albums not retrieved: ${err.message}`)));
      });
    });

    it('Should not retrieve bought albums from another user, if logged as user', done => {
      UserRequests.signInAsDefaultUser().then(session => {
        request
          .get(`/users/${session.userId + 1}/albums`)
          .set(session.header, session.token.raw)
          .then(res => done(new Error('Successful response - This should not be called')))
          .catch(err => {
            err.should.have.status(403);
            err.response.should.be.json;
            err.response.body.should.have.property('message');
            err.response.body.message.should.be.a('string');
            err.response.body.message.should.include('You cannot see others albums');
            done();
          });
      });
    });
  });

  describe('GET users/albums/:id/photos', () => {
    it('Should not retrive bought albums from user, if not logged', done => {
      request
        .get(`/users/albums/1/photos`)
        .then(res => done(new Error('Successful response - This should not be called')))
        .catch(err => {
          err.should.have.status(401);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.message.should.be.a('string');
          err.response.body.message.should.include('no auth header found:');
          done();
        });
    });

    const albumId = 1;

    it(`Should not get photos from not bought album with id: ${albumId}`, done => {
      UserRequests.signInAsDefaultUser()
        .then(session => {
          request
            .get(`/users/albums/${albumId}/photos`)
            .set(session.header, session.token.raw)
            .then(res => done(new Error('Successful response - This should not be called')))
            .catch(err => {
              err.should.have.status(404);
              err.response.should.be.json;
              err.response.body.should.have.property('message');
              err.response.body.message.should.include(`Album purchase with albumId ${albumId} not found`);
              done();
            });
        })
        .catch(err => done(new Error(`Could not sign in with default user: ${err.message}`)));
    });

    it(`Should get photos from bought album with id: ${albumId}, if logged as user`, done => {
      UserRequests.signInAsDefaultUser()
        .then(session => {
          request
            .post(`/albums/${albumId}`) // default user buys album id: 1
            .set(session.header, session.token.raw)
            .then(resAlbumPurchase => {
              request
                .get(`/users/albums/${albumId}/photos`)
                .set(session.header, session.token.raw)
                .then(resPhotos => {
                  resPhotos.should.have.status(200);
                  resPhotos.should.be.json;
                  resPhotos.body.should.be.an('array');
                  resPhotos.body.should.all.have.property('id');
                  resPhotos.body.should.all.have.property('albumId', albumId);
                  resPhotos.body.should.all.have.property('title');
                  resPhotos.body.should.all.have.property('url');
                  resPhotos.body.should.all.have.property('thumbnailUrl');
                  done();
                })
                .catch(err => {
                  done(new Error(`Could not retrieve photos for album with id ${albumId}: ${err.message}`));
                });
            })
            .catch(err => done(new Error(`Could buy album with id ${albumId}: ${err.message}`)));
        })
        .catch(err => done(new Error(`Could not sign in with default user: ${err.message}`)));
    });

    it(`Should get photos from bought album with id: ${albumId}, if logged as admin`, done => {
      UserRequests.signInAsDefaultAdmin()
        .then(session => {
          request
            .post(`/albums/${albumId}`) // default user buys album id: 1
            .set(session.header, session.token.raw)
            .then(resAlbumPurchase => {
              request
                .get(`/users/albums/${albumId}/photos`)
                .set(session.header, session.token.raw)
                .then(resPhotos => {
                  resPhotos.should.have.status(200);
                  resPhotos.should.be.json;
                  resPhotos.body.should.be.an('array');
                  resPhotos.body.should.all.have.property('id');
                  resPhotos.body.should.all.have.property('albumId', albumId);
                  resPhotos.body.should.all.have.property('title');
                  resPhotos.body.should.all.have.property('url');
                  resPhotos.body.should.all.have.property('thumbnailUrl');
                  done();
                })
                .catch(err => {
                  done(new Error(`Could not retrieve photos for album with id ${albumId}: ${err.message}`));
                });
            })
            .catch(err => done(new Error(`Could buy album with id ${albumId}: ${err.message}`)));
        })
        .catch(err => done(new Error(`Could not sign in with default user: ${err.message}`)));
    });
  });
});
