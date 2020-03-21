const express = require('express')
const router = express.Router()

const Order = require('../models/order')

// get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// getting one order
router.get('/:id', getOrder, (req, res) => {
  res.json(res.order)
})

// create one order
router.post('/', async (req, res) => {
  const order = new Order({
    items: req.body.items,
    store: req.body.store,
    code: generateCode(),
    sumTotal: calculatePrice(req.body.items),
  })

  try {
    const newOrder = await order.save()
    res.status(201).json(newOrder)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// delete one order
router.delete('/:id', getOrder, async (req, res) => {
  try {
    await res.order.remove()
    res.json({ message: 'Deleted This Order' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Middleware function for gettig order object by ID
async function getOrder(req, res, next) {
  try {
    order = await Order.findById(req.params.id)
    if (order == null) {
      return res.status(404).json({ message: 'Cant find order' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.order = order
  next()
}


//TODO: create random code
function generateCode() {
  return "corvid-19"
}

//TODO: calculate order sum
function calculatePrice(items) {
  return 240;
}

module.exports = router