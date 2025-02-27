const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotEnv = require('dotenv');

const Vendor = require("../models/Vendor.model.js");

dotEnv.config();

const secretKey = process.env.SECRETE_KEY

const vendorRegister = async(req, res) => {
    // get the details form body
    const {username, email, password} = req.body

    // token based authentication

    try {
        // by using the email which is come fom req.body 
        // Vendor model lo vunna email ni BD call chesi danni store chesthamu 

        const vendorEmail = await Vendor.findOne({email});

        // check if the vendor Email is prasent or not

        if(vendorEmail){
            console.log("Email is already taken... try another")

            return res.status(400).json("Email is alredy taken....")
        }

        // Next hash the password user nuchi vachhedhi 

        const hashedPassword = await bcrypt.hash(password, 10)

        // e values ni oka instance ni create chesi DB lo store cheyyali

        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        });

        await newVendor.save()

        res.status(201).json({message : "Vendor registered successfully "})

        console.log('vender registered succesfully....')


    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Internal Server error while registering the vendor "})
        
    }
}

// Vendor Login

const vendorLogin = async(req, res ) => {
    const {email, password} = req.body
    try {
        // getting the email from DB using VENDOR model
        const vendor = await Vendor.findOne({email});

        // vendor lo vunna password manam icchina password both correct vunnaya leva ani check chesthunnamu 

        if(!vendor || !(await bcrypt.compare(password, vendor.password))){

            return res.status(401).json("Invalid email & password.. for login purpose ")
        }

//step8 generating TOken (seceret key ni own ga generate chesthamu )

        const token = jwt.sign({venderId: vendor._id}, secretKey, {expiresIn: "1h"})

        const vendorId = vendor._id;


        res.status(200)
        .json({success: "vendor logged succesfully...","jwtToken": token, vendorId})

    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Internal Server error while logging the vendor "})
        
    }
    // crate a route for this 
}

const getAllVendors = async(req, res) => {
    try {
        const vendors = await Vendor.find().populate('firm');

        // console.log(vendors);
    
        res.json({vendors});

    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Internal Server error while getting the details of vendor from firm "})
    }
}


// getting single vendor details by using ids 

const getVendorById = async(req, res) => {

    const vendorId = req.params.id;

    try {
        const vendor = await Vendor.findById(vendorId).populate('firm');

        

        if (!vendor) {
            return res.status(404).json({error: "Error while getting single vendor details fron DB"})
        }
        const vendorFirmId = vendor.firm[0]._id
        res.status(200).json({vendorFirmId, vendorId})

        

    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Internal Server error while getting the details of single vendor from DB "})
    
    }

}


module.exports = {vendorRegister, vendorLogin, getAllVendors, getVendorById }










