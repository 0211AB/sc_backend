const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require('../routes/user');
const categoryRouter = require('../routes/category');
const productRouter = require('../routes/product');
const companyRouter = require('../routes/company');
const quotationRouter = require('../routes/quotation');
const brochureRouter = require('../routes/brochure');
const invoiceRouter = require('../routes/invoice');
const dashboardRouter = require('../routes/dashboard');
const cloudinary = require('cloudinary').v2;
require("dotenv").config();

const app = express();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const URI = process.env.DB_URI;

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("⚡ Database Connected");
}).catch((e) => {
    console.error(e);
});

app.use('/api/v1', userRouter);
app.use('/api/v1', categoryRouter);
app.use('/api/v1', productRouter);
app.use('/api/v1', companyRouter);
app.use('/api/v1', quotationRouter);
app.use('/api/v1', brochureRouter);
app.use('/api/v1', invoiceRouter);
app.use('/api/v1', dashboardRouter);

app.get("/api/v1", (req, res) => {
    res.send('<h1> Hello World !!</h1>');
});

module.exports.handler = serverless(app);
