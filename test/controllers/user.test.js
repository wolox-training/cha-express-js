const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiThings = require('chai-things');
const dictum = require('dictum.js');

const should = chai.should();
chai.use(chaiThings);

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
          dictum.chai(res, 'Creates user');
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
          console.log(JSON.stringify(err, null, 2));
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
            email: user.email,
            password: user.password
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

  describe('GET /users', () => {
    const createUserAndSignIn = () => {
      const user = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@wolox.com.ar',
        password: 'johndoereloaded'
      };

      return request
        .post('/users')
        .send(user)
        .then(res => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.have.property('id');
          res.body.id.should.be.a('number');
          return request.post('/users/sessions').send({
            email: user.email,
            password: user.password
          });
        })
        .then(resToken => {
          resToken.should.have.status(200);
          resToken.should.be.json;
          resToken.body.should.have.property('token');
          resToken.body.token.should.be.a('string');
          resToken.body.should.have.property('header');
          resToken.body.token.should.be.a('string');
          return resToken.body;
        });
    };

    const createSomeUsers = number => {
      const promisesUserCreation = [];
      for (let index = 0; index < number; index++) {
        promisesUserCreation.push(
          request.post('/users').send({
            firstname: `John${index}`,
            lastname: `Doe${index}`,
            email: `john.doe${index}@wolox.com.ar`,
            password: `johndoe${index}`
          })
        );
      }
      return promisesUserCreation;
    };

    it('Should return an authentication error, because auth header not found', done => {
      request
        .get('/users')
        .then(res => {
          done(new Error('Successful response - This should not be called'));
        })
        .catch(err => {
          err.should.have.status(401);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.message.should.include('no auth header found:');
          done();
        });
    });

    it('Should return an authentication error, because malformed token', done => {
      request
        .get('/users')
        .set('auth_token', 'Bearer sarasa')
        .then(res => {
          done(new Error('Successful response - This should not be called'));
        })
        .catch(err => {
          err.should.have.status(401);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.message.should.include('jwt malformed');
          done();
        });
    });

    it('Should return an error for invalid page number', done => {
      createUserAndSignIn()
        .then(json => {
          return request
            .get('/users')
            .set(json.header, json.token)
            .send({
              page_number: -1,
              page_size: 10
            });
        })
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
              keyword: 'minimum',
              dataPath: '.page_number',
              schemaPath: '#/properties/page_number/minimum',
              params: {
                comparison: '>=',
                limit: 1,
                exclusive: false
              },
              message: 'should be >= 1'
            }
          ]);
          done();
        });
    });

    it('Should return and error for invalid page size', done => {
      createUserAndSignIn()
        .then(json => {
          return request
            .get('/users')
            .set(json.header, json.token)
            .send({
              page_number: 1,
              page_size: -10
            });
        })
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
              keyword: 'minimum',
              dataPath: '.page_size',
              schemaPath: '#/properties/page_size/minimum',
              params: {
                comparison: '>=',
                limit: 1,
                exclusive: false
              },
              message: 'should be >= 1'
            }
          ]);
          done();
        });
    });

    it('Should retrieve the first users page list', done => {
      createUserAndSignIn()
        .then(json => {
          return request.get('/users').set(json.header, json.token);
        })
        .then(res => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('page_number');
          res.body.page_number.should.be.a('number');
          res.body.should.have.property('users');
          res.body.users.should.all.be.an('array');
          res.body.users.should.have.lengthOf(1);
          res.body.should.have.property('pages_left');
          res.body.pages_left.should.be.a('number');
          res.body.should.have.property('overflow');
          res.body.overflow.should.be.a('boolean');
          done();
        })
        .catch(err => {
          done(new Error(`User page not retrieved: ${err.message}`));
        });
    });

    it('Should retrieve a users page list that does not exists', done => {
      createUserAndSignIn()
        .then(json => {
          return request
            .get('/users')
            .set(json.header, json.token)
            .send({
              page_number: 2,
              page_size: 10
            });
        })
        .then(res => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('page_number');
          res.body.page_number.should.be.a('number');
          res.body.page_number.should.equal(2);
          res.body.should.have.property('users');
          res.body.users.should.all.be.an('array');
          res.body.users.should.be.empty;
          res.body.should.have.property('pages_left');
          res.body.pages_left.should.be.a('number');
          res.body.pages_left.should.be.equal(0);
          res.body.should.have.property('overflow');
          res.body.overflow.should.be.a('boolean');
          res.body.overflow.should.equal(true);
          done();
        })
        .catch(err => {
          done(new Error(`User not be authenticated: ${err.message}`));
        });
    });

    it('Should retrieve a users page list that has one page ahead', done => {
      const tenPromisesUserCreation = createSomeUsers(10);

      Promise.all(tenPromisesUserCreation).then(() => {
        createUserAndSignIn()
          .then(json => {
            return request
              .get('/users')
              .set(json.header, json.token)
              .send({
                page_number: 1,
                page_size: 6
              });
          })
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('page_number');
            res.body.page_number.should.be.a('number');
            res.body.page_number.should.equal(1);
            res.body.should.have.property('users');
            res.body.users.should.all.be.an('array');
            res.body.users.should.have.lengthOf(6);
            res.body.should.have.property('pages_left');
            res.body.pages_left.should.be.a('number');
            res.body.pages_left.should.be.equal(1);
            res.body.should.have.property('overflow');
            res.body.overflow.should.be.a('boolean');
            res.body.overflow.should.equal(false);
            done();
          })
          .catch(err => {
            done(new Error(`User not be authenticated: ${err.message}`));
          });
      });
    });
  });
});
