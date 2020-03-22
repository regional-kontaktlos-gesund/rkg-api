require('dotenv').config()
const path = require('path')

var express = require('express');
var cors = require('cors')
var app = express();

const checkJwt = require('./auth0')

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

// basic GET route
app.get('/', function (req, res) {
  res.send('OK');
});

// test route for user-profile
app.get('/api/userprofile', checkJwt, function (req, res) {

  let authtoken = req.headers.authorization.replace("Bearer ", "")
  let userData

  console.log(req.user)

  var AuthenticationClient = require('auth0').AuthenticationClient;

  var auth0 = new AuthenticationClient({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID
  });

  auth0.getProfile(authtoken, function (err, userInfo) {
    if (err) {
      console.log(err.message)
    }    
    console.log(userInfo)
    userData = userInfo
  });
  console.log("userdata", userData)
  if (userData == "Unauthorized") {
    res.status(401).json({ message: userData })
  } else {
    res.status(200).json({ message: userData })
  }
  
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