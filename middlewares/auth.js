const jwt = require('jsonwebtoken');

function isRequired(req, res, next) {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    req.cookies.token;

  if (!token) {
    res.status(403).json({status: 'error',
      errors: [{name: 'NoToken', message: 'Unauthorized: No token provided'}]});
  } else {
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) {
        res.status(403).json({status: 'error',
          errors: [{
            name: 'InvalidToken',
            message: 'Unauthorized: Invalid token'},
          ]});
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
}

function isOptional(req, res, next) {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (!err) {
        req.userId = decoded.id;
      }
    });
  }
  return next();
}

module.exports = {
  optional: isOptional,
  required: isRequired,
};
