const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

chai.use(chaiHttp);
const server = require('../../app');

const request = chai.request(server);

describe('UserController', () => {
  const validUser = {
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@wolox.com.ar',
    password: 'johndoereloaded'
  };

  it('Should create a user', done => {
    request
      .post('/users')
      .send(validUser)
      .then(res => {
        res.should.have.status(201);
        done();
      })
      .catch(err => {
        done(new Error(`User not created: ${err.message}`));
      });
  });

  const userWithoutEmail = {
    firstname: 'John',
    lastname: 'Doe',
    password: 'johndoereloaded'
  };

  it('Should not create a user without email', done => {
    request
      .post('/users')
      .send(userWithoutEmail)
      .then(res => {
        done(new Error('This should not be called'));
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        done();
      });
  });

  const userWithShortPassword = {
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@wolox.com.ar',
    password: 'asd'
  };

  it('Should not create an user with a short password', done => {
    request
      .post('/users')
      .send(userWithShortPassword)
      .then(res => {
        done(new Error('This should not be called'));
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        done();
      });
  });

  const emptyUser = {
    firstname: '',
    lastname: '',
    password: '',
    email: ''
  };

  it('Should not create an empty user', done => {
    request
      .post('/users')
      .send(emptyUser)
      .then(res => {
        done(new Error('This should not be called'));
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        done();
      });
  });
});
