const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Name is Required']
    },
    phone: { type: String },
    gst_number: { type: String },
    email: { type: String },
    address_line_1: {
        type: String,
        trim: true,
    },
    address_line_2: {
        type: String,
        trim: true,
    },
    address_line_3: {
        type: String,
        trim: true,
    },
    address_line_4: {
        type: String,
        trim: true,
    },
    employees: [{
        name: {
            type: String,
            trim: true,
            required: [true, 'Name is Required']
        },
        phone: { type: String },
        email: { type: String },
        location: { type: String }
    }]
});

const Company = new mongoose.model("company", CompanySchema);

module.exports = Company;