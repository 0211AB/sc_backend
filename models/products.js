const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Name is Required']
    },
    images: [String],
    company: { type: String },
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'category' }],
    description: { type: String },
    materials: [String],
    colors: [String],
    cost_price: {
        type: Number,
        required: [true, 'Cost Price is Required']
    },
    cost_price_inclusive_tax: {
        type: Boolean,
        default: true
    },
    gst: { type: Number },
    hsn_code: { type: Number }
});

const Product = new mongoose.model("product", ProductSchema);

module.exports = Product;