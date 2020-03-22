const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Product = require('./product').schema 

const OpeningHourSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['monday','truesday','wednesday','thirsday','friday','saturday','sunday','holiday'],
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },    
})

const storeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    vendor: { 
      type: Schema.Types.ObjectId, 
      ref: 'Vendor', 
      required: true 
    },
    latitude: {
      type: Number,
      required: true
    },  
    longitude: {
      type: Number,
      required: true
    },
    products: [Product],
    openingHours: [OpeningHourSchema],
    currentlyOpen: {
      type: Boolean,
    }
  })

  module.exports = mongoose.model('Store', storeSchema)