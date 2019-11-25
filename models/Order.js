const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  article: {
    type: String,
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
});

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.SchemaTypes.ObjectId,
    required: [true, 'can\'t be blank'],
  },

  items: [{
    type: orderItemSchema,
  }],

  isPaid: Boolean,
  isCompleted: Boolean,
}, {timestamps: true});


mongoose.model('Order', orderSchema);
