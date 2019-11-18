const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const errors = require('../../../../helpers/errors');

const Product = mongoose.model('Product');

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
