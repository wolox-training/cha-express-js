const dictum = require('dictum.js');

dictum.setFormatter('markdown');

dictum.document({
  description: 'Creates a User',
  endpoint: '/users',
  method: 'POST',
  requestHeaders: {},
  requestPathParams: {},
  requestBodyParams: {
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@wolox.com.ar',
    password: 'johndoepwd'
  },
  responseStatus: 201,
  responseHeaders: {
    contentType: 'application/json'
  },
  responseBody: {
    id: 1
  },
  resource: 'A User'
});

dictum.document({
  description: 'Retrives user by given id',
  endpoint: '/users/:id',
  method: 'GET',
  requestHeaders: {},
  requestPathParams: {
    id: 1
  },
  requestBodyParams: {},
  responseStatus: 200,
  responseHeaders: {
    contentType: 'application/json'
  },
  responseBody: {
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@wolox.com.ar'
  },
  resource: 'A User'
});
