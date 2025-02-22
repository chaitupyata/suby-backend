const mongoose = require("mongoose")

const vendorSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firm: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Firm'
        }
    ]

}, {timestamps: true})

const Vendor = mongoose.model("Vendor", vendorSchema)

module.exports = Vendor;

// Step4 : Vendor Controller.js

