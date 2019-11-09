const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.SchemaTypes.ObjectId,
    required: [true, 'can\t be blank'],
  },

  date: {
    type: Date,
    required: [true, 'can\t be blank'],
  },

  price: {
    type: Number,
    required: [true, 'can\t be blank'], // TODO: add validator
  },

  products: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  }],

  isPaid: Boolean,
}, {timestamps: true});


mongoose.model('Order', orderSchema);
