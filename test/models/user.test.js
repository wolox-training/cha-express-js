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
    const createUserPromise = User.create(validUser);
    const fetchUserPromise = createUserPromise.then(user => {
      user.should.have.property('id');
      return User.find({
        where: {
          id: user.id
        },
        attributes: {
          exclude: ['password']
        }
      });
    });

    Promise.all([createUserPromise, fetchUserPromise])
      .then(([createdUser, fetchedUser]) => {
        createdUser.should.have.property('id');
        fetchedUser.should.have.property('id');
        fetchedUser.id.should.equal(createdUser.id);
        fetchedUser.firstname.should.equal(validUser.firstname);
        fetchedUser.lastname.should.equal(validUser.lastname);
        fetchedUser.email.should.equal(validUser.email);
        done();
      })
      .catch(err => {
        done(new Error(`Error: ${err.message}`));
      });
  });

  it('Should not create a user with existng email', done => {
    User.create(validUser)
      .then(createdUser => {
        return User.create(validUser);
      })
      .then(otherCreatedUser => {
        done(new Error(`Creation succeed, should not be called`));
      })
      .catch(err => {
        done();
      })
      .catch(err => {
        done(new Error(`DB error - User not created: ${err.message}`));
      });
  });
});
