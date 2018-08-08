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
          done(new Error(`Admin not fetch: ${err.message}`));
        })
        .catch(err => {
          done(new Error(`Admin not created: ${err.message}`));
        });
    });

    it('Should create an admin over existing user', done => {
      request
        .post('/users')
        .send(validAdmin)
        .then(res => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.id.should.be.a('number');
          return request.post('/admin/users').send(validAdmin);
        })
        .then(resTwo => {
          done();
        })
        .catch(err => {
          console.log(JSON.stringify(err.response.body, null, 2));
          done(new Error(`Admin not created: ${err.message}`));
        })
        .catch(errTwo => {
          done(new Error(`User not created in first attempt: ${errTwo.message}`));
        });
    });

    it('Should not create a user with existing email', done => {
      request
        .post('/admin/users')
        .send(validAdmin)
        .then(res => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.id.should.be.a('number');
          return request.post('/admin/users').send(validAdmin);
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

    const adminWithoutEmail = {
      firstname: 'John',
      lastname: 'Doe',
      password: 'johndoereloaded'
    };

    it('Should not create a user without email', done => {
      request
        .post('/admin/users')
        .send(adminWithoutEmail)
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

    const adminWithShortPassword = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@wolox.com.ar',
      password: 'asd'
    };

    it('Should not create an user with a short password', done => {
      request
        .post('/admin/users')
        .send(adminWithShortPassword)
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

    const emptyAdmin = {
      firstname: '',
      lastname: '',
      password: '',
      email: ''
    };

    it('Should not create an empty user', done => {
      request
        .post('/admin/users')
        .send(emptyAdmin)
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
});
