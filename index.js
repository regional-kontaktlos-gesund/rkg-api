require('dotenv').config()
const path = require('path')

var express = require('express');
var cors = require('cors')
var app = express();

const checkJwt = require('./middlewares/auth0')
const checkUser = require('./middlewares/checkUser')

//swagger stuff
var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//app.use('/api/', router);

// register middlewares
app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

//mongoose stuff
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('✅ Connected to database'))

app.options('*', cors()) // include before other routes

// test route for user-profile
app.get('/api/userprofile', checkUser, function (req, res) {
  res.status(200).send(req.body) 
});

// test route for authentication
app.get('/api/authtest', checkJwt, function (req, res) {
  res.status(200).json({ message: "you are authenticated" })
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
  console.log(`🚀 Server is running on port ${PORT}`);
});