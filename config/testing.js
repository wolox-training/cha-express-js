exports.config = {
  environment: 'testing',
  isTesting: true,
  common: {
    session: {
      auth_header: 'auth_token',
      jwt_secret: 'testing_secret',
      jwt_expire_time_secs: 60 * 5
    },
    urls: {
      albums: process.env.ALBUMS_URL
    }
  }
};
