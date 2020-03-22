const express = require('express')
const router = express.Router()

const fs = require("fs");
const animals = fs.readFileSync("./resources/animals.txt").toString('utf-8').split("\n")
const colors = fs.readFileSync("./resources/colors.txt").toString('utf-8').split("\n")


const Order = require('../models/order')
const Store = require('../models/store')

// get all orders
// TODO: restrict Order retrieval to current user from req.body.userId
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// getting one order (including nested product information)
router.get('/:id', getOrder, async (req, res) => {
  order = res.order
  newItems = []
  for (const item of order.items) {
      store = await Store.findById(order.store)
      if (store) {
        newProduct = await store.products.id(item.product)
        newItem = {
          product: newProduct, 
          amount: item.amount
        }
        newItems.push(newItem)
      }
  };
  const newOrder = {
    items: newItems,
    store: order.store,
    code: order.code,
    sumTotal: order.sumTotal
  }
  res.json(newOrder)
})

// create one order
router.post('/', async (req, res) => {
  const order = new Order({
    items: req.body.items,
    store: req.body.store,
    code: generateCode(),
    sumTotal: await calculatePrice(req.body.items, req.body.store),
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
// TODO: restrict Order retrieval to current user from req.body.userId
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


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function generateCode() {
  let codeword = colors[getRandomInt(colors.length)].toLowerCase() + "-" + animals[getRandomInt(animals.length)].toLowerCase()
  return codeword
}

async function calculatePrice(items, store_id) {
  let sum = 0;
  store = await Store.findById(store_id)
  if (store != null) {
    items.forEach(item => {
      product = store.products.id(item.product)
      let positionPrice = product.price * item.amount
      sum += positionPrice
    });
  }
  return sum;
}

module.exports = router