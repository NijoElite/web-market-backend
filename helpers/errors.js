const forbidden = {
  status: 'error',
  errors: [{
    name: 'Forbidden',
    message: 'You don\'t have permissions',
  }],
};

const userNotFound = {
  status: 'error',
  errors: [{
    name: 'UserNotFound',
    message: 'User not found',
  }],
};

const wrongRequest = {
  status: 'error',
  errors: [{
    name: 'WrongRequest',
    message: 'The request cannot be fulfilled due to bad syntax',
  }],
};

const authenticationError = {
  status: 'error',
  errors: [{name: 'AuthenticationError',
    message: 'Wrong email or password'}],
};

module.exports = {forbidden, userNotFound, wrongRequest, authenticationError};
