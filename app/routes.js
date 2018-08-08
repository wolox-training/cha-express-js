const UsersController = require('./controllers/users');
const AdminsController = require('./controllers/admins');

const { Validator, ValidationError } = require('express-json-validator-middleware');
const Auth = require('./middlewares/auth');

const UserJsonSchema = require('./json-schemas/user');
const AdminJsonSchema = require('./json-schemas/user');

const validate = new Validator({ allErrors: true }).validate;

exports.init = app => {
  app.get(
    '/users',
    [Auth.secureFor(['user']), validate({ body: UserJsonSchema.forList })],
    UsersController.list
  );
  app.get('/users/:id', [], UsersController.get);
  app.post('/users', [validate({ body: UserJsonSchema.forCreate })], UsersController.create);
  app.post('/users/sessions', [validate({ body: UserJsonSchema.forSession })], UsersController.session);
  app.post('/admin/users', [validate({ body: AdminJsonSchema.forCreate })], AdminsController.create);

  // Handles body validation errors
  app.use((err, req, res, next) => {
    if (err instanceof ValidationError) {
      res.status(400).json(err);
      next();
    } else next(err);
  });
};
