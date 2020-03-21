require('dotenv').config()
const path = require('path')

var express = require('express');
var app = express();

const checkJwt = require('./auth0')

// register middlewares
app.use(checkJwt);
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

//mongoose stuff
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

// basic GET route
app.get('/', function (req, res) {
  res.send('Hello World!');
});

// routes for vendors
const vendorsRouter = require('./routes/vendors')
app.use('/api/vendors', vendorsRouter)

// routes for stores
const storesRouter = require('./routes/stores')
app.use('/api/stores', storesRouter)

// routes for orders
const ordersRouter = require('./routes/orders')
app.use('/api/orders', ordersRouter)

// run app
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});