const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const auth = require('../../../../middlewares/auth');

const Product = mongoose.model('Product');
const Order = mongoose.model('Order');

// Create Order
router.post('/', auth.required, async function(req, res, next) {
  const items = req.body.items;

  try {
    for (item of items) {
      const product = await Product.findOne({article: item.article});
      item.price = product.price;
    }

    const order = new Order({
      items: items,
      customer: req.userId,
      isPaid: false,
      isCompleted: false,
    });

    await order.save();

    res.json({
      status: 'success',
      data: {
        id: order._id,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
