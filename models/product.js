const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["Erdbeere", "Spargel"],
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: String,
    enum: ["none", "full", "medium", "low"],
    required: true
  },
  imageUrl: {
    type: String
  },
})

module.exports = mongoose.model('Product', productSchema)