exports.forCreate = {
  type: 'object',
  required: ['firstname', 'lastname', 'email', 'password'],
  properties: {
    firstname: {
      type: 'string',
      minLength: 1
    },
    lastname: {
      type: 'string',
      minLength: 1
    },
    email: {
      type: 'string',
      minLength: 1
    },
    password: {
      type: 'string',
      minLength: 8
    }
  }
};
