const Vender = require('../models/Vendor.model.js')
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

dotEnv.config();

const secretKey = process.env.SECRETE_KEY


const verifyTokenMiddleware = async(req, res, next) => {
    const token = req.headers.token;

    if(!token){
        return res.status(401).json({error: "Token is required"});
    }
    try {
        const decoded = jwt.verify(token, secretKey)

        console.log(decoded)

        const vendorID  = await Vender.findById(decoded.venderId) 

        console.log(vendorID);
        

        if(!vendorID){
            return res.status(404).json({error: "Vendor is not found in DB"})

        }
        req.vendorId = vendorID._id

        next()
    } catch(error) {
        console.error(error)
        return res.status(500).json({error: "Invalid token"});

    }
}

module.exports = verifyTokenMiddleware;

// by using this we can add the add firm to Vendor 