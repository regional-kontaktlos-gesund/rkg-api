const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const storeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    owner: { 
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
    stripeAccountId: {
      type: String
    },
    products: [
      {
       type: Schema.Types.ObjectId, 
       ref: 'Product' 
      }
    ],
    openingHours: [
      { 
        type: Schema.Types.ObjectId, ref: 'OpeningHour' 
      }
    ],
    opened: {
      type: Boolean,
    }
  })

  module.exports = mongoose.model('Store', storeSchema)