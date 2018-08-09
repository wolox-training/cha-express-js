const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiThings = require('chai-things');
const server = require('../../app');

chai.use(chaiHttp);
chai.use(chaiThings);

const request = chai.request(server);
const should = chai.should();

exports.signInAsDefaultAdmin = () => {
  return request
    .post('/users/sessions')
    .send({
      email: 'admin@wolox.com.ar',
      password: 'default1234'
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

exports.signInAsDefaultUser = () => {
  return request
    .post('/users/sessions')
    .send({
      email: 'user@wolox.com.ar',
      password: 'default1234'
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
