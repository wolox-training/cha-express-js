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

exports.forSession = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
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

exports.forList = {
  type: 'object',
  properties: {
    page_number: {
      type: 'integer',
      minimum: 1
    },
    page_size: {
      type: 'integer',
      minimum: 1,
      maximum: 1000
    }
  }
};
