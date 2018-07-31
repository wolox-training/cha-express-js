const assert = require('chai').assert;
const should = require('chai').should();
const User = require('../../app/models').User;

const validUser = {
  firstname: 'John',
  lastname: 'Doe',
  email: 'john.doe@wolox.com.ar',
  password: 'johndoereloaded'
};

const userWithoutEmail = {
  firstname: 'John',
  lastname: 'Doe',
  password: 'johndoereloaded'
};

describe('UserService', () => {
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

  it('Should not create a user without email', done => {
    User.createModel(userWithoutEmail)
      .then(createdUser => {
        done(new Error('this should not be called'));
      })
      .catch(err => {
        console.log(JSON.stringify(err));
        done();
      });
  });
});
