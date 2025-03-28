
const dotEnv = require("dotenv");
const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const vendorRoutes = require('./routes/vendorRoutes.js');
const firmRoutes = require("./routes/firmRoutes.js");
const productRoutes = require('./routes/productRoutes.js');
const cors = require('cors');
const path = require('path')

const app = express();
const PORT = process.env.PORT || 4000;


dotEnv.config();
app.use(cors())

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected Successfully!"))
.catch((error) => console.log(error))

// step6 : input filed lo vasthunna data ni json loki parse cheyyali (body-parser dwara) 

app.use(bodyParser.json());

// step5

app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);
app.use('/uploads', express.static('uploads'));


app.listen(PORT, () => {
    console.log(`server started running at ${PORT}`);
})

app.use('/', (req, res) => {
    res.send("<h1> Welcome to SUBY </h1>")
})
// Step 2 Connceting to DB
// Api Creation Models , controllers , Routes
// Stpe 5: Create a httprequest  kosam oka middleware ni use cheyyali 

