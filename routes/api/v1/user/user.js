const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const auth = require('../../../../middlewares/auth');
const errors= require('../../../../helpers/errors');

const User = mongoose.model('User');

const fullProjection = '-password -updatedAt -__v -isDeleted -salt';
const partialProjection = fullProjection + ' -email -birthday';

// TODO: add captcha
// Register User
router.post('/', async function(req, res, next) {
  const body = req.body;
  console.log(body);
  const user = new User({
    email: body['email'],
    password: body['password'],
    firstName: body['firstName'],
    secondName: body['secondName'],
    lastName: body['lastName'],
    birthday: Date.parse(body['birthday']),
  });

  try {
    const savedUser = await user.save();
    res.json({
      status: 'success',
      data: {
        _id: savedUser._id,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Delete User
router.post('/delete', auth.required, async function(req, res, next) {
  const {id} = req.body;

  if (id !== req.userId) {
    return res.status(403).json(errors.forbidden);
  }

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(400).json(errors.userNotFound);
    }

    res.json({
      status: 'success',
      data: {
        _id: id,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Update User Data
router.post('/update', async function(req, res, next) {
  const {id, ...params} = req.body;

  if (id !== req.userId) {
    return res.status(403).json(errors.forbidden);
  }

  if (params.role) {
    params.role = params.role.split(',');
  }

  try {
    const user = await User.findByIdAndUpdate(id, params,
        {useFindAndModify: false, new: true}).lean();

    if (!user) {
      return res.status(404).json(errors.userNotFound);
    }

    res.json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Get User Data
router.get('/', auth.optional, async function(req, res, next) {
  const {id} = req.query;
  const projection = (req.userId === id) ? fullProjection : partialProjection;

  try {
    const user = await User.findById(id, projection).lean();

    if (!user) {
      return res.status(404).json(errors.userNotFound);
    }

    res.json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
