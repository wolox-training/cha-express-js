exports.forCreate = {
  type: 'object',
  required: ['firstname', 'lastname', 'email', 'password'],
  properties: {
    firstname: {
      type: 'string'
    },
    lastname: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    password: {
      type: 'string',
      minLength: 8
    }
  }
};
