const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiThings = require('chai-things');
const dictum = require('dictum.js');

const should = chai.should();
chai.use(chaiThings);

chai.use(chaiHttp);
const server = require('../../app');

const request = chai.request(server);

describe('AdminController', () => {
  describe('POST /admin/users', () => {
    const validAdmin = {
      firstname: 'JohnAdmin',
      lastname: 'Doe',
      email: 'johnadmin.doe@wolox.com.ar',
      password: 'johndoereloaded'
    };

    it('Should create an admin', done => {
      request
        .post('/admin/users')
        .send(validAdmin)
        .then(res => {
          res.should.have.status(201);
          res.should.be.json;
          dictum.chai(res, 'Creates admin');
          res.body.id.should.be.a('number');
          return request.get(`/users/${res.body.id}`);
        })
        .then(getRes => {
          getRes.should.have.status(200);
          getRes.should.be.json;
          getRes.body.should.have.property('firstname');
          getRes.body.firstname.should.equal(validAdmin.firstname);
          getRes.body.should.have.property('lastname');
          getRes.body.lastname.should.equal(validAdmin.lastname);
          getRes.body.should.have.property('email');
          getRes.body.email.should.equal(validAdmin.email);
          getRes.body.should.have.property('role');
          getRes.body.role.should.equal('admin');
          done();
        })
        .catch(err => {
          console.log(JSON.stringify(err, null, 2));
          done(new Error(`Admin not fetch: ${err.message}`));
        })
        .catch(err => {
          done(new Error(`Admin not created: ${err.message}`));
        });
    });
  });
});
