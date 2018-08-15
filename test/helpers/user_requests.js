const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');

chai.use(chaiHttp);
const request = chai.request(server);

exports.signInAsDefaultAdmin = () => {
  return request
    .post('/users/sessions')
    .send({
      email: 'admin@wolox.com.ar',
      password: 'default1234'
    })
    .then(resToken => {
      return resToken.body;
    });
};

exports.signInAsDefaultUser = () => {
  return request
    .post('/users/sessions')
    .send({
      email: 'user@wolox.com.ar',
      password: 'default1234'
    })
    .then(resToken => {
      return resToken.body;
    });
};

exports.createSomeUsers = number => {
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
