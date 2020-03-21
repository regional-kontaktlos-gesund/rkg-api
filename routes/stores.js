const express = require('express')
const router = express.Router()

const Store = require('../models/store')

// get all stores
router.get('/', async (req, res) => {
  try {
    const stores = await Store.find()
    res.json(stores)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// getting one store
router.get('/:id', getStore, (req, res) => {
  res.json(res.store)
})

// create one store
router.post('/', async (req, res) => {
  const store = new Store({
    name: req.body.name,
    owner: req.body.owner,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  })

  try {
    const newStore = await store.save()
    res.status(201).json(newStore)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Updating one store
// TODO: Update additional store fields: longitude, latitude, stripeAccountId, products
router.patch('/:id', getStore, async (req, res) => {
  if (req.body.name != null) {
    res.store.name = req.body.name
  }
  if (req.body.owner != null) {
    res.store.owner = req.body.owner
  }
  if (req.body.opened != null) {
    res.store.opened = req.body.opened
  }
  if (req.body.openingHours != null) {
    res.store.openingHours = req.body.openingHours
  }
  try {
    const updatedStore = await res.store.save()
    res.json(updatedStore)
  } catch {
    res.status(400).json({ message: err.message })
  }
})

// delete one store
router.delete('/:id', getStore, async (req, res) => {
  try {
    await res.store.remove()
    res.json({ message: 'Deleted This Store' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Middleware function for gettig store object by ID
async function getStore(req, res, next) {
  try {
    store = await Store.findById(req.params.id)
    if (store == null) {
      return res.status(404).json({ message: 'Cant find store' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.store = store
  next()
}

module.exports = router