const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message =>
  internalError(
    {
      name: message.name,
      errors: message.errors.map(err => {
        return {
          error: err.message
        };
      })
    },
    exports.DATABASE_ERROR
  );

exports.NOT_FOUND = 'not_found';
exports.notFound = resource => internalError(`${resource} not found`, exports.NOT_FOUND);

exports.INVALID_CREDENTIALS = 'invalid_credentials';
exports.invalidCredentials = err => internalError(err.message, exports.INVALID_CREDENTIALS);

exports.NOT_ALLOWED = 'not_allowed';
exports.notAllowed = err =>
  internalError(`You are not allowed to consume this resource: ${err.message}`, exports.NOT_ALLOWED);
