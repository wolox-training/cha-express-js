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
exports.bookNotFound = internalError('resource not found', exports.NOT_FOUND);
