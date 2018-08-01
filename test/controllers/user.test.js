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
        res.should.be.json;
        res.body.id.should.be.a('number');
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
        err.response.body.should.have.property('name');
        err.response.body.should.have.property('validationErrors');
        err.response.body.validationErrors.should.have.property('body');
        err.response.body.validationErrors.body.should.be.an('array');
        err.response.body.validationErrors.body.should.deep.include.members([
          {
            keyword: 'required',
            dataPath: '',
            schemaPath: '#/required',
            params: {
              missingProperty: 'email'
            },
            message: "should have required property 'email'"
          }
        ]);
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
        err.response.body.should.have.property('name');
        err.response.body.should.have.property('validationErrors');
        err.response.body.validationErrors.should.have.property('body');
        err.response.body.validationErrors.body.should.be.an('array');
        err.response.body.validationErrors.body.should.deep.include.members([
          {
            keyword: 'minLength',
            dataPath: '.password',
            schemaPath: '#/properties/password/minLength',
            params: {
              limit: 8
            },
            message: 'should NOT be shorter than 8 characters'
          }
        ]);
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
        err.response.body.should.have.property('name');
        err.response.body.should.have.property('validationErrors');
        err.response.body.validationErrors.should.have.property('body');
        err.response.body.validationErrors.body.should.be.an('array');
        err.response.body.validationErrors.body.should.deep.include.members([
          {
            keyword: 'minLength',
            dataPath: '.firstname',
            schemaPath: '#/properties/firstname/minLength',
            params: {
              limit: 1
            },
            message: 'should NOT be shorter than 1 characters'
          },
          {
            keyword: 'minLength',
            dataPath: '.lastname',
            schemaPath: '#/properties/lastname/minLength',
            params: {
              limit: 1
            },
            message: 'should NOT be shorter than 1 characters'
          },
          {
            keyword: 'minLength',
            dataPath: '.email',
            schemaPath: '#/properties/email/minLength',
            params: {
              limit: 1
            },
            message: 'should NOT be shorter than 1 characters'
          },
          {
            keyword: 'minLength',
            dataPath: '.password',
            schemaPath: '#/properties/password/minLength',
            params: {
              limit: 8
            },
            message: 'should NOT be shorter than 8 characters'
          }
        ]);
        done();
      });
  });
});
