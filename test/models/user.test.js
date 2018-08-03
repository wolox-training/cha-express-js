const chai = require('chai');
const User = require('../../app/models').User;

const should = chai.should();

describe('User', () => {
  const validUser = {
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@wolox.com.ar',
    password: 'johndoereloaded'
  };

  it('Should create a user', done => {
    User.create(validUser)
      .then(createdUser => {
        createdUser.should.have.property('id');
        User.findById(createdUser.id)
          .then(foundUser => {
            foundUser.should.have.property('id');
            foundUser.id.should.equal(createdUser.id);
            done();
          })
          .catch(err => {
            done(new Error(`DB error - User coul not be found: ${err.message}`));
          });
      })
      .catch(err => {
        done(new Error(`DB error - User not created: ${err.message}`));
      });
  });

  it('Should not create a user with existng email', done => {
    User.create(validUser)
      .then(createdUser => {
        User.create(validUser)
          .then(otherCreatedUser => {
            done(new Error(`Creation succeed, should not be called`));
          })
          .catch(err => {
            done();
          });
      })
      .catch(err => {
        done(new Error(`DB error - User not created: ${err.message}`));
      });
  });
});
