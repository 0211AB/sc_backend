const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
    ref: {
        type: String,
    },
    date: {
        type: String,
        required: true,
        default: (new Date()).toDateString()
    },
    company: {
        type: String,
        required: true,
    },
    companyRef: {
        type: mongoose.Schema.Types.ObjectId, ref: 'company'
    },
    address_line_1: {
        type: String,
    },
    address_line_2: {
        type: String,
    },
    address_line_3: {
        type: String,
    },
    address_line_4: {
        type: String,
    },
    subject: {
        type: String,
        required: true,
    },
    introduction: {
        type: String,
    },
    items: {
        type: [],
        default: []
    },
    terms: {
        type: String,
    },
    conclusion: {
        type: String,
    },
    name: {
        type: String,
        required: true,
        default: 'Lalit Kumar Jhanwar'
    },
    details: {
        type: String,
        required: true,
        default: '9831455721/ lalitjhanwar@outlook.com'
    }
});

const Quotation = new mongoose.model('quotation', quotationSchema);

module.exports = Quotation
