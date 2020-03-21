require('dotenv').config()

var express = require('express');
var app = express();

app.use(express.json())

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
app.use('/vendor', vendorsRouter)


// run app
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});