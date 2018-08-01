const assert = require('chai').assert;
const should = require('chai').should();
const User = require('../../app/models').User;

describe('UserService', () => {
  const validUser = {
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@wolox.com.ar',
    password: 'johndoereloaded'
  };

  it('Should create a user', done => {
    User.createModel(validUser)
      .then(createdUser => {
        console.log(createdUser.id);
        assert.isNotNull(createdUser.id);
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
    User.createModel(userWithoutEmail)
      .then(createdUser => {
        done(new Error('this should not be called'));
      })
      .catch(err => {
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
    User.createModel(emptyUser)
      .then(createdUser => {
        done(new Error('this should not be called'));
      })
      .catch(err => {
        done();
      });
  });
});
