const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiThings = require('chai-things');
const dictum = require('dictum.js');

const should = chai.should();
chai.use(chaiThings);

chai.use(chaiHttp);
const server = require('../../app');

const request = chai.request(server);

describe('AlbumsController', () => {
  describe('GET /albums', () => {
    it('Should retrieve a list of albums', done => {
      request
        .get('/albums')
        .then(res => {
          res.should.have.status(200);
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
