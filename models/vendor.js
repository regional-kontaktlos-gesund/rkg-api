const mongoose = require('mongoose')

const vendorSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    }, 
    stripeAccountId: {
      type: String
    },
    email: {
      type: String,
      required: true
    }
  })

  module.exports = mongoose.model('Vendor', vendorSchema)