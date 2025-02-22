const vendorController = require('../controllers/vendorController.js');
const express = require('express');

// express lo vunna inbuild method ni use chesi router ni create cheyyali 


const router = express.Router();

router.post('/register', vendorController.vendorRegister);
router.post('/login', vendorController.vendorLogin);
router.get('/all-vendors', vendorController.getAllVendors);
router.get('/single-vendor/:id', vendorController.getVendorById )




// export the router


module.exports = router;

// step 5 ; import the router in index.js  http request ni create cheyyali 




