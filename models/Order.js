const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  article: {
    type: String,
    required: [true, 'can\'t be blank'],
  },
  seller: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: [true, 'can\'t be blank'],
  },
  qty: {
    type: Number,
    required: [true, 'can\'t be blank'],
  },
  price: {
    type: Number,
    required: [true, 'can\'t be blank'],
  },
  isPaid: Boolean,
});

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: [true, 'can\'t be blank'],
  },

  items: [{
    type: orderItemSchema,
  }],
}, {timestamps: true});


mongoose.model('Order', orderSchema);
