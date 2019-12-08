const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const auth = require('../../../../middlewares/auth');
const errors = require('../../../../helpers/errors');

const Product = mongoose.model('Product');
const Order = mongoose.model('Order');
const User = mongoose.model('User');

// Create Order
router.post('/', auth.required, async function(req, res, next) {
  const items = req.body.items;

  try {
    for (item of items) {
      const product = await Product.findOne({article: item.article});
      if (!product) continue;

      item.price = product.price;
      item.seller = product.owner;
      item.isPaid = false;
    }

    const order = new Order({
      items: items,
      customer: req.userId,
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

// Get Orders For User
router.get('/user', auth.required, async function(req, res, next) {
  try {
    const user = await User.findById(req.userId);

    if (!user || !user.role.includes('user')) {
      return res.json(errors.forbidden);
    }

    const orders = await Order.find({customer: req.userId}).
        populate('items.seller');

    res.json({
      status: 'success',
      data: orders,
    });
  } catch (err) {
    next(err);
  }
});

// Get Orders For Seller
router.get('/customer', auth.required, async function(req, res, next) {
  try {
    const user = await User.findById(req.userId);

    if (!user || !user.role.includes('customer')) {
      return res.json(errors.forbidden);
    }

    const orders = await Order.find({
      items: {
        $elemMatch: {
          seller: user._id,
        },
      },
    }).populate('customer');

    for (const order of orders) {
      order.items = order.items.filter((item) => {
        return item.seller.toString() === user._id.toString();
      });
    }

    res.json({
      status: 'success',
      data: orders,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/changeStatus', auth.required, async function(req, res, next) {
  if (typeof req.body.status === 'undefined') {
    return res.json(errors.wrongRequest);
  }

  try {
    const user = await User.findById(req.userId);

    if (!user || !user.role.includes('customer')) {
      return res.json(errors.forbidden);
    }

    const order = await Order.findById(req.body.order).populate('customer');

    if (!order) {
      return res.json(errors.orderNotFound);
    }

    const item = order.items.find((item) => item.article === req.body.article);

    if (!item) {
      return res.json(errors.orderNotFound);
    }

    item.isPaid = !!req.body.status;

    await order.save();

    const orderData = order.toObject();
    res.json({
      status: 'success',
      data: {...orderData},
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
