const createError = require('http-errors');

const forbiddenError = () => {
  return createError(403, 'Not enough permissions to access');
};

const hasRole = (user, role) => user.role.includes(role);

function isUser(req, res, next) {
  if (hasRole(req.user, 'user')) {
    next();
  } else {
    next(forbiddenError());
  }
}

function isAdmin(req, res, next) {
  if (hasRole(req.user, 'admin')) {
    next();
  } else {
    next(forbiddenError());
  }
}

function isCustomer(req, res, next) {
  if (hasRole(req.user, 'customer')) {
    next();
  } else {
    next(forbiddenError());
  }
}


module.exports = {isUser, isAdmin, isCustomer};
