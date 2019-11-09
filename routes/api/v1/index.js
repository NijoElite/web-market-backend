const express = require('express');
const errors= require('../../../helpers/errors');

const router = new express.Router();

router.use('/auth', require('./auth/auth'));
router.use('/user', require('./user/user'));

// Validation Errors
router.use(function(err, req, res, next) {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      status: 'error',
      errors: Object.keys(err.errors).reduce(function(errors, key) {
        errors.push({
          name: 'ValidationError',
          field: key,
          message: err.errors[key].message,
        });
        return errors;
      }, []),
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json(errors.wrongRequest);
  }

  next(err);
});

module.exports = router;
