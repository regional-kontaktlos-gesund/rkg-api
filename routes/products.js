const express = require('express')
const router = express.Router()

const Product = require('../models/product')

// get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// getting one product
router.get('/:id', getProduct, (req, res) => {
  res.json(res.product)
})

// create one product
router.post('/', async (req, res) => {
  const product = new Product({
    name: req.body.name,
    type: req.body.type,
    unit: req.body.unit,
    price: req.body.price,
    stock: req.body.stock,
    imageUrl: req.body.imageUrl
  })

  try {
    const newProduct = await product.save()
    res.status(201).json(newProduct)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Updating one product
// TODO: Add additional product fields
router.patch('/:id', getProduct, async (req, res) => {
  if (req.body.name != null) {
    res.product.name = req.body.name
  }

  if (req.body.type != null) {
    res.product.type = req.body.type
  }
  try {
    const updatedProduct = await res.product.save()
    res.json(updatedProduct)
  } catch {
    res.status(400).json({ message: err.message })
  }
})

// delete one product
router.delete('/:id', getProduct, async (req, res) => {
  try {
    await res.product.remove()
    res.json({ message: 'Deleted This Product' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Middleware function for gettig product object by ID
async function getProduct(req, res, next) {
  try {
    product = await Product.findById(req.params.id)
    if (product == null) {
      return res.status(404).json({ message: 'Cant find product' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.product = product
  next()
}

module.exports = router