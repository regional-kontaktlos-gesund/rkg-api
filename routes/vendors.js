const express = require('express')
const router = express.Router()

const Vendor = require('../models/vendor')

// get all vendors
router.get('/', async (req, res) => {
    try {
        const vendors = await Vendor.find()
        res.json(vendors)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Getting one vendor
router.get('/:id', getVendor, (req, res) => {
  res.json(res.vendor)
})

// create one vendor

router.post('/', async (req, res) => {
    const vendor = new Vendor({
      name: req.body.name,
      email: req.body.email
    })
  
    try {
      const newVendor = await vendor.save()
      res.status(201).json(newVendor)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })


  // Middleware function for gettig vendor object by ID
async function getVendor(req, res, next) {
  try {
    vendor = await Vendor.findById(req.params.id)
    if (vendor == null) {
      return res.status(404).json({ message: 'Cant find vendor'})
    }
  } catch(err){
    return res.status(500).json({ message: err.message })
  }
  
  res.vendor = vendor
  next()
}

module.exports = router