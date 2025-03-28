const Firm = require('../models/Firm.model.js');
const Vendor = require('../models/Vendor.model.js');
const multer = require('multer')
const path = require('path')

// multer file uploade 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        console.log("FILE----", file)
        cb(null, file.name);
    }
});

const upload = multer({storage: storage})


const addFirm = async(req, res) => {
    try {
        const { firmName, area, category, region, offer } = req.body;

        const image = req.file ? req.file.filename : undefined;

        const vendor = await Vendor.findById(req.vendorId);

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
        const deleteFirm = await Firm.findById(firmId);

        if(!deleteFirm){
            // console.error(error);
            return res.status(404).json({error: "no Firm found to delete "})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server error while deleting the Firm"})
    }
} 

module.exports = {addFirm: [upload.single('image'), addFirm], deleteFirmById}


