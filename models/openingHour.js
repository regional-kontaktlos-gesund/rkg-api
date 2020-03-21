const mongoose = require('mongoose')


const openingHourSchema = new mongoose.Schema({
    day: {
      type: String,
      enum : ['monday','truesday','wednesday','thirsday','friday','saturday','sunday','holiday'],
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

  module.exports = mongoose.model('OpeningHour', openingHourSchema)