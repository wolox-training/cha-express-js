const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');

const config = require('../../config');

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

exports.useUserExpiredSession = () => {
  return {
    header: config.common.session.auth_header,
    token: {
      raw:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InJlZ3VsYXIiLCJleHAiOjE1MzQ0NDU5MTcsImlhdCI6MTUzNDQ0NTg1N30.xwBZB6ioUZ-Blp08tV_zLrXvAy8kGlQGfo_OrwrUFhU',
      exp: 1534445917,
      iat: 1534445857
    }
  };
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
