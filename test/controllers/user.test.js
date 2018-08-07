const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

chai.use(chaiHttp);
const server = require('../../app');

const request = chai.request(server);

describe('UserController', () => {
  describe('POST /users', () => {
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
          return request.get(`/users/${res.body.id}`);
        })
        .then(getRes => {
          getRes.should.have.status(200);
          getRes.should.be.json;
          getRes.body.firstname.should.equal(validUser.firstname);
          getRes.body.lastname.should.equal(validUser.lastname);
          getRes.body.email.should.equal(validUser.email);
          done();
        })
        .catch(err => {
          done(new Error(`User not fetch: ${err.message}`));
        })
        .catch(err => {
          done(new Error(`User not created: ${err.message}`));
        });
    });

    it('Should not create a user with existing email', done => {
      request
        .post('/users')
        .send(validUser)
        .then(res => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.id.should.be.a('number');
          return request.post('/users').send(validUser);
        })
        .then(resTwo => {
          done(new Error('Successful response - This should not be called'));
        })
        .catch(err => {
          err.should.have.status(503);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.message.should.have.property('name');
          err.response.body.message.name.should.equal('SequelizeUniqueConstraintError');
          err.response.body.message.should.have.property('errors');
          err.response.body.message.errors.should.be.an('array');
          err.response.body.message.errors.should.deep.include.members([
            {
              error: 'email must be unique'
            }
          ]);
          err.response.body.should.have.property('internal_code');
          err.response.body.internal_code.should.equal('database_error');
          done();
        })
        .catch(errTwo => {
          done(new Error(`User not created in first attempt: ${errTwo.message}`));
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
          done(new Error('Successful response - This should not be called'));
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
          done(new Error('Successful response - This should not be called'));
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
          done(new Error('Successful response - This should not be called'));
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

  describe('POST /users/sessions', () => {
    it('Should return a token', done => {
      const user = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@wolox.com.ar',
        password: 'johndoereloaded'
      };

      request
        .post('/users')
        .send(user)
        .then(res => {
          const userCreds = {
            email: 'john.doe@wolox.com.ar',
            password: 'johndoereloaded'
          };

          return request.post('/users/sessions').send(userCreds);
        })
        .then(resTwo => {
          resTwo.should.have.status(200);
          resTwo.should.be.json;
          resTwo.body.should.have.property('token');
          resTwo.body.token.should.be.a('string');
          done();
        })
        .catch(err => {
          done(new Error(`User not be authenticated: ${err.message}`));
        });
    });

    it('Should not return a token, because invalid email', done => {
      const user = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@wolox.com.ar',
        password: 'johndoereloaded'
      };

      request
        .post('/users')
        .send(user)
        .then(res => {
          const userCreds = {
            email: 'asd@wolox.com.ar',
            password: 'johndoeland'
          };

          return request.post('/users/sessions').send(userCreds);
        })
        .then(resTwo => {
          done(new Error('Successful response - This should not be called'));
        })
        .catch(err => {
          err.should.have.status(401);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.message.should.be.a('string');
          err.response.body.message.should.equal('invalid email');
          err.response.body.should.have.property('internal_code');
          err.response.body.internal_code.should.be.a('string');
          err.response.body.internal_code.should.equal('invalid_credentials');
          done();
        });
    });

    it('Should not return a token, because invalid password', done => {
      const user = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@wolox.com.ar',
        password: 'johndoereloaded'
      };

      request
        .post('/users')
        .send(user)
        .then(res => {
          const userCreds = {
            email: 'john.doe@wolox.com.ar',
            password: 'johndoeinvalid'
          };

          return request.post('/users/sessions').send(userCreds);
        })
        .then(resTwo => {
          done(new Error('Successful response - This should not be called'));
        })
        .catch(err => {
          err.should.have.status(401);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.message.should.be.a('string');
          err.response.body.message.should.equal('invalid password');
          err.response.body.should.have.property('internal_code');
          err.response.body.internal_code.should.be.a('string');
          err.response.body.internal_code.should.equal('invalid_credentials');
          done();
        });
    });
  });
});
