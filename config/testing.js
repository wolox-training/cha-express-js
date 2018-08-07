exports.config = {
  environment: 'testing',
  isTesting: true,
  common: {
    session: {
      auth_header: 'auth_token',
      jwt_secret: 'testing_secret'
    }
  }
};
