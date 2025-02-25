const dotEnv = require("dotenv");
const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const vendorRoutes = require('./routes/vendorRoutes.js');
const firmRoutes = require("./routes/firmRoutes.js");
const productRoutes = require('./routes/productRoutes.js');
const cors = require('cors');






const app = express();
const PORT = process.env.PORT || 4000;

dotEnv.config();

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected Successfully!"))
.catch((error) => console.log(error))

// step6 : input filed lo vasthunna data ni json loki parse cheyyali (body-parser dwara) 

app.use(bodyParser.json());
app.use(cors());


// step5

app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);
app.use('/uploads', express.static('uploads'));


app.listen(PORT, () => {
    console.log(`server started running at ${PORT}`);
})

app.use('/home', (req, res) => {
    res.send("<h1> Welcome to suby </h1>")
})
// Step 2 Connceting to DB
// Api Creation Models , controllers , Routes
// Stpe 5: Create a httprequest  kosam oka middleware ni use cheyyali 

