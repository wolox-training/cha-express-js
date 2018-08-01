const UsersController = require('./controllers/users');
const { Validator, ValidationError } = require('express-json-validator-middleware');

const UserJsonSchema = require('./json-schemas/user');

const validate = new Validator({ allErrors: true }).validate;

exports.init = app => {
  app.post('/users', [validate({ body: UserJsonSchema.forCreate })], UsersController.create);

  // Handles body validation errors
  app.use((err, req, res, next) => {
    if (err instanceof ValidationError) {
      res.status(400).json(err);
      next();
    } else next(err);
  });
};
