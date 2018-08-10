const bcrypt = require('bcryptjs');
const User = require('../app/models').User;

exports.execute = () => {
  return bcrypt
    .hash('default1234', 10)
    .then(hash => {
      const entities = [
        User.create({
          firstname: 'Default',
          lastname: 'Admin',
          email: 'admin@wolox.com.ar',
          password: hash,
          role: 'admin'
        }),
        User.create({
          firstname: 'Default',
          lastname: 'User',
          email: 'user@wolox.com.ar',
          password: hash,
          role: 'regular'
        })
      ];
      return Promise.all(entities);
    })
    .catch(bcryptErr => {
      throw bcryptErr;
    });
};
