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
      UserRequests.signInAsDefaultUser().then(json => {
        request
          .get('/albums')
          .set(json.header, json.token)
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
      UserRequests.signInAsDefaultAdmin().then(json => {
        request
          .get('/albums')
          .set(json.header, json.token)
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
    it('Should not purchase an album, if not logged', done => {
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
  });
});
