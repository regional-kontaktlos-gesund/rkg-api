const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const OrderItemSchema = new mongoose.Schema({
  product: {
     type: Schema.Types.ObjectId, 
     ref: 'Product',
     required: true
  },
  amount: {
    type: Number,
    required: true
  },
  price: {
    type: Number
  }
})

const orderSchema = new mongoose.Schema({

  items: [OrderItemSchema],
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  code: {
    type: String
  },
  sumTotal: {
    type: Number
  }
})

module.exports = mongoose.model('Order', orderSchema)