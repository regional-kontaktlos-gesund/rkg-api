const express = require('express')
const router = express.Router()
const checkUser = require('../middlewares/checkUser')
const Vendor = require('../models/vendor')

// getting one vendor
router.get('/:id', checkUser, getVendor, (req, res) => {
  res.json(res.vendor)
})

// create one vendor
// TODO: create middleware to check of user has been created in auth0 and store user.id in database as well
router.post('/signup', async (req, res) => {
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


// Updating one vendor
router.patch('/:id', checkUser, getVendor, async (req, res) => {
  if (req.body.name != null) {
    res.vendor.name = req.body.name
  }
  if (req.body.email != null) {
    res.vendor.email = req.body.email
  }
  if (req.body.stripeAccountId != null) {
    const stripe = require('stripe')(process.env.STRIPE_KEY);
    const response = await stripe.oauth.token({
      grant_type: 'authorization_code',
      code: req.body.code,
    });
    if (response.error) {
      res.status(400).json({ message: response.error_description })
    }
    res.vendor.stripeAccountId = response.stripe_user_id;
  }
  try {
    const updatedVendor = await res.vendor.save()
    res.json(updatedVendor)
  } catch {
    res.status(400).json({ message: err.message })
  }
})

// delete one vendor
// TODO: delete vendor by auth0 hook
router.delete('/:id', checkUser, getVendor, async (req, res) => {
  try {
    await res.vendor.remove()
    res.json({ message: 'Deleted This Vendor' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Middleware function for gettig vendor object by ID
async function getVendor(req, res, next) {
  let vendor
  try {
    if (req.body.vendorId == req.params.id) {
      vendor = await Vendor.findById(req.body.vendorId)
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  if (vendor == null) {
    return res.status(404).json({ message: 'Cant find vendor' })
  } else {
    res.vendor = vendor
    next()
  }
}

module.exports = router