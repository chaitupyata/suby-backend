


const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotEnv = require('dotenv');


const Vendor = require("../models/Vendor.model.js");

dotEnv.config();

const secretKey = process.env.SECRETE_KEY;

const vendorRegister = async(req, res) => {
    const {username, email, password} = req.body;


    try {
        // by using the email which is come fom req.body 
        // Vendor model lo vunna email ni BD call chesi danni store chesthamu 

        const vendorEmail = await Vendor.findOne({ email });

        // check if the vendor Email is prasent or not

        if(vendorEmail){
            console.log("Email is already taken... try another")

            return res.status(400).json("Email is alredy taken....");
        }

        // Next hash the password user nuchi vachhedhi 

        const hashedPassword = await bcrypt.hash(password, 10);

        // e values ni oka instance ni create chesi DB lo store cheyyali

        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        });

        await newVendor.save();

        res.status(201).json({message : "Vendor registered successfully "});

        console.log('Vender registered succesfully....');


    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Internal Server error while registering the vendor "});
        
    }
};

// Vendor Login

const vendorLogin = async(req, res ) => {
    const {email, password} = req.body
    try {
        // getting the email from DB using VENDOR model
        const vendor = await Vendor.findOne({ email });

        // vendor lo vunna password manam icchina password both correct vunnaya leva ani check chesthunnamu 

        if(!vendor || !(await bcrypt.compare(password, vendor.password))){

            return res.status(401).json("Invalid email & password.. for login purpose ")
        }

//step8 generating TOken (seceret key ni own ga generate chesthamu )

        const token = jwt.sign({venderId: vendor._id}, secretKey, {expiresIn: "1h"})

        const vendorId = vendor._id;
    


        res.status(200)
        .json({success: "vendor logged succesfully...","jwtToken": token, vendorId});

    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Internal Server error while logging the vendor "});
        
    }
    // crate a route for this 
};

const getVendorById = async(req, res) => {
    const vendorId = req.params.id;

    try {
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }
        console.log("vendor =>=====>", vendor)
        
        const vendorFirmId = vendor.firm[0]._id;
        const vendorFirmName = vendor.firm[0].firmName;


        res.status(200).json({ vendorId, vendorFirmId, vendor, vendorFirmName })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error while getting the Single vendor details from DB !!!" });
    }
};



const getAllVendors = async(req, res) => {
    
    try {
        const vendors = await Vendor.find().populate('firm');
        res.json({ vendors });

        // if(!vendors){
        //     console.error(error)
        //     res.status(500).json({error: "Internal Server error while getting the details of vendor from firm "})
        // }
        // console.log(vendors);
    

    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Internal Server error while getting the details of vendor from firm "})
    }
};


module.exports = {vendorRegister, vendorLogin, getAllVendors, getVendorById}









