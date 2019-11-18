const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const errors = require('../../../../helpers/errors');

const Product = mongoose.model('Product');

// Get Latest Products
router.get('/latest', async function(req, res, next) {
  const countPerPage = 20;
  const {page = 0} = req.query;
  try {
    const skip = page * countPerPage;
    const products = await Product.find({}).skip(skip).limit(countPerPage);
    res.json(products);
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
