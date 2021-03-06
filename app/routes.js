const UsersController = require('./controllers/users');
const AlbumsController = require('./controllers/albums');

const { Validator, ValidationError } = require('express-json-validator-middleware');
const Auth = require('./middlewares/auth');

const UserJsonSchema = require('./json-schemas/user');
const AdminJsonSchema = require('./json-schemas/user');

const validate = new Validator({ allErrors: true }).validate;

exports.init = app => {
  // Users
  app.get(
    '/users',
    [Auth.secureFor(['regular', 'admin']), validate({ body: UserJsonSchema.forList })],
    UsersController.list
  );
  app.get('/users/:id', [], UsersController.get);
  app.get('/users/:id/albums', [Auth.secureFor(['regular', 'admin'])], UsersController.boughtAlbums);
  app.get(
    '/users/albums/:id/photos',
    [Auth.secureFor(['regular', 'admin'])],
    UsersController.photosBoughtAlbum
  );
  app.post('/users', [validate({ body: UserJsonSchema.forCreate })], UsersController.createUser);
  app.post('/users/sessions', [validate({ body: UserJsonSchema.forSession })], UsersController.session);
  app.post('/users/sessions/invalidate_all', [], UsersController.invalidateSessions);
  app.post(
    '/admin/users',
    [Auth.secureFor(['admin']), validate({ body: AdminJsonSchema.forCreate })],
    UsersController.createAdmin
  );

  // Albums
  app.get('/albums', [Auth.secureFor(['regular', 'admin'])], AlbumsController.all);
  app.post('/albums/:id', [Auth.secureFor(['regular', 'admin'])], AlbumsController.buy);

  // Handles body validation errors
  app.use((err, req, res, next) => {
    if (err instanceof ValidationError) {
      res.status(400).json(err);
      next();
    } else next(err);
  });
};
