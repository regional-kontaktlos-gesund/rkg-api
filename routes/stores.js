const express = require('express')
const router = express.Router()

const Store = require('../models/store')
const Product = require('../models/product')

// get all stores
router.get('/', async (req, res) => {
  try {
    let stores
    if (req.query.vendor != null) {
      stores = await Store.find({ vendor : req.query.vendor })
    } else {
      stores = await Store.find() 
    }
    res.json(stores)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// get all stores in specific area
router.get('/radius', async (req, res) => {
  try {
    let stores
    let coords
    coords = calcCoords(req.body.latitude, req.body.longitude, req.body.distance)
    stores = await Store.find().where('latitude').gt(coords.minLat).lt(coords.maxLat).where('longitude').gt(coords.minLong).lt(coords.maxLong)
    res.json(stores)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// getting one store
router.get('/:id', getStore, (req, res) => {
  res.json(res.store)
})

// getting all products for one store
router.get('/:id/products', getStore, (req, res) => {
  res.json(res.store.products)
})

// create one store
router.post('/', async (req, res) => {
  const store = new Store({
    name: req.body.name,
    vendor: req.body.vendor,
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


// add one product for one store
router.patch('/:id/products', getStore, async (req, res) => {
  const product = new Product({
    name: req.body.name,
    type: req.body.type,
    unit: req.body.unit,
    price: req.body.price,
    stock: req.body.stock,
    imageUrl: req.body.imageUrl,
  })
  
  try {
    await res.store.products.push(product)
    const updatedStore = await res.store.save()
    res.json(updatedStore)
  } catch(err) {
    res.status(400).json({ message: err.message })
  }
})

// Updating one store
router.patch('/:id', getStore, async (req, res) => {
  if (req.body.name != null) {
    res.store.name = req.body.name
  }
  if (req.body.vendor != null) {
    res.store.vendor = req.body.vendor
  }
  if (req.body.currentlyOpen != null) {
    res.store.currentlyOpen = req.body.currentlyOpen
  }
  if (req.body.openingHours != null) {
    res.store.openingHours = req.body.openingHours
  }
  if (req.body.longitude != null) {
    res.store.longitude = req.body.longitude
  }
  if (req.body.latitude != null) {
    res.store.latitude = req.body.latitude
  }
  if (req.body.stripeAccountId != null) {
    res.store.stripeAccountId = req.body.stripeAccountId
  }
  
  try {
    const updatedStore = await res.store.save()
    res.json(updatedStore)
  } catch(err) {
    res.status(400).json({ message: err.message })
  }
})

// Delete one store
router.delete('/:id', getStore, async (req, res) => {
  try {
    await res.store.remove()
    res.json({ message: 'Deleted This Store' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// delete one product from one store
router.delete('/:id/products/:productID', getStore, async (req, res) => {
  try {  
    product = await res.store.products.id(req.params.productID)
    product.remove();
    res.store.save();
    res.json({ message: 'Deleted This Product' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
 
// update one product from one store
router.patch('/:id/products/:productID', getStore, async (req, res) => {
  try {
    product = await res.store.products.id(req.params.productID)
  
    if (req.body.name != null) {
      product.name = req.body.name
    }
    if (req.body.type != null) {
      product.type = req.body.type
    }
    if (req.body.unit != null) {
      product.unit = req.body.unit
    }
    if (req.body.price != null) {
      product.price = req.body.price
    }
    if (req.body.stock != null) {
      product.stock = req.body.stock
    }
    if (req.body.imageUrl != null) {
      product.imageUrl = req.body.imageUrl
    }

    res.store.save()
    res.json({ message: 'Updated This Product' })
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

// function to calculate area
function calcCoords(lat, long, distance) {
  const distance_const = 111120
  let latInMeter = distance_const
  let meterInLat = 1 / latInMeter

  let longInMeter = distance_const * Math.cos(lat * Math.PI / 180);
  let meterInLong = 1 / longInMeter

  let distanceInLat = distance * meterInLat
  let distanceInLong = distance * meterInLong

  let coords = {
    minLat: lat - distanceInLat,
    maxLat: lat + distanceInLat,
    minLong: long - distanceInLong,
    maxLong: long + distanceInLong
  }
  return coords
}

module.exports = router