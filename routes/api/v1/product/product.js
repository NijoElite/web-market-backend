const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const errors = require('../../../../helpers/errors');
const auth = require('../../../../middlewares/auth');

const Product = mongoose.model('Product');
const User = mongoose.model('User');

// Get Latest Products
router.get('/latest', async function(req, res, next) {
  const countPerPage = 20;
  const {page = 0} = req.query;
  try {
    const skip = page * countPerPage;
    const products = await Product.find({}).skip(skip).limit(countPerPage);
    res.json({
      status: 'success',
      data: products,
    });
  } catch (err) {
    next(err);
  }
});


// Get Own Products
router.get('/own', auth.required, async function(req, res, next) {
  const {userId} = req;

  try {
    const fields = 'article owner name description price requirements ' +
    'publisher releaseDate sliderImage defaultImage rating genres';

    const products = await Product.find({owner: userId}, fields).lean();

    if (!products) {
      return res.json(errors.productNotFound);
    }

    res.json({
      status: 'success',
      data: [...products],
    });
  } catch (err) {
    next(err);
  }
});

// Create Product
router.post('/', auth.required, async function(req, res, next) {
  const {
    name,
    description,
    price,
    publisher,
    releaseDate,
    sliderImage,
    defaultImage,
    requirements,
    genres,
  } = req.body;

  const article = name + '-' + Date.now().toString(16);

  const ownerId = req.userId;

  try {
    const owner = await User.findById(ownerId);

    if (!owner.role.includes('customer')) {
      return res.json(errors.forbidden);
    }

    const product = new Product({
      requirements, owner, article, name, description,
      price, publisher, releaseDate, sliderImage,
      defaultImage, genres});

    await product.save();

    res.json({
      status: 'success',
      data: {
        productId: product._id,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Get Product Data
router.get('/:article', async function(req, res, next) {
  const {article} = req.params;

  try {
    const fields = 'article owner name description price requirements' +
    'publisher releaseDate sliderImage defaultImage rating genres';

    const product = await Product.findOne({article}, fields).lean();

    if (!product) {
      return res.json(errors.productNotFound);
    }

    res.json({
      status: 'success',
      data: {
        ...product,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
