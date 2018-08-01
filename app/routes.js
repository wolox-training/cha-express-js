const UsersController = require('./controllers/users');

exports.init = app => {
  app.post('/users', [], UsersController.create);
};
