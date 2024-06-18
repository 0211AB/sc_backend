const mongoose = require('mongoose');

const BrochureSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId, ref: 'company'
    },
    items: [{
        productRef: {
            type: mongoose.Schema.Types.ObjectId, ref: 'product'
        },
        sale_price: { type: String },
        sale_price_inclusive_tax: { type: Boolean }
    }],
}, { timestamps: true });

const Brochure = new mongoose.model('brochure', BrochureSchema);

module.exports = Brochure
