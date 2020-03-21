const express = require('express')
const router = express.Router()


// import mock data
const vendors = require('../test/vendors.json')

// get all vendors
router.get('/', (req, res) => {

    //send mock data
    res.send(vendors)
})

// get one vendor
router.get('/:id', (req, res) => {
    let result = {};
    vendors.forEach(vendor => {
        if (vendor.id == req.params.id) {
            result = vendor
        }
    });
    res.send(result)

})

module.exports = router