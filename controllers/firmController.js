
const Firm = require('../models/Firm.model.js');
const Vendor = require('../models/Vendor.model.js');
const multer = require('multer')
const path = require('path')

// multer file uploade 
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // Destination folder where the uploaded images will be stored
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Generating a unique filename

        
    }
});

const upload = multer({storage: storage})


const addFirm = async(req, res) => {
    try {
        let { firmName, area, category, region, offer } = req.body;

          // ✅ Convert category and region to arrays if they are strings
        if (typeof category === "string") {
            category = JSON.parse(category);
        }
        if (typeof region === "string") {
            region = JSON.parse(region);
        }


        console.log("REQ BODY ", req.body)



        const image = req.file ? req.file.filename : undefined;

        console.log("REQ IMAGE FORM ", image)


        const vendor = await Vendor.findById(req.vendorId);

        console.log("VENDOR  ", vendor)

        if (!vendor) {
            res.status(404).json({ message: "Vendor not found" })
        }

        if (vendor.firm.length > 0) {
            return res.status(400).json({ message: "vendor can have only one firm" });
        }

        const firm = new Firm({
            firmName,
            area,
            category,
            region,
            offer,
            image,
            vendor: vendor._id
        })

        const savedFirm = await firm.save();

        console.log("SAVED FIRM,,", savedFirm)

        const firmId = savedFirm._id
        const vendorFirmName = savedFirm.firmName


        vendor.firm.push(savedFirm)
        await vendor.save()

        return res.status(200).json({ message: 'Firm Added successfully ', firmId, vendorFirmName });
    } catch (error) {
        console.error(error)
        res.status(500).json("intenal server error")
    }
}
// delete firm

const deleteFirmById = async(req, res) => {
    try {
        const firmId = req.params.firmId;
        
        const deleteProduct = await Firm.findByIdAndDelete(firmId);

        if(!deleteProduct){
            // console.error(error);
            return res.status(404).json({ error: "No product found" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server error while deleting the Firm"})
    }
} 

module.exports = {addFirm: [upload.single('image'), addFirm], deleteFirmById}


