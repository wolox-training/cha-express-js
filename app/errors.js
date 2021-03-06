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

exports.EXTERNAL_API_ERROR = 'external_api_error';
exports.externalApiError = err =>
  internalError(`Externa api error: ${err.message}`, exports.EXTERNAL_API_ERROR);

exports.NOT_FOUND = 'not_found';
exports.notFound = resource => internalError(`${resource} not found`, exports.NOT_FOUND);

exports.INVALID_CREDENTIALS = 'invalid_credentials';
exports.invalidCredentials = err => internalError(err.message, exports.INVALID_CREDENTIALS);

exports.NOT_ALLOWED = 'not_allowed';
exports.notAllowed = err =>
  internalError(`You are not allowed to consume this resource: ${err.message}`, exports.NOT_ALLOWED);

exports.FORBIDDEN = 'forbidden';
exports.forbiddenError = err =>
  internalError(`The request has been forbidden: ${err.message}`, exports.FORBIDDEN);
