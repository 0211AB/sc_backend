const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema
const invoiceDetailsSchema = new Schema({
    number: { type: String, required: true },
    date: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    place_of_supply: { type: String, required: true },
    can_reverse: { type: Boolean, default: false },
    gst: { type: String, required: true },
    purchase_order_number: { type: String },
    recipient_gst_state: { type: String },
    recipient_gst_statecode: { type: String },
    place_of_supply_gst_state: { type: String },
    place_of_supply_gst_statecode: { type: String },
    packaging: { type: String },
    isIGST: { type: Boolean },
    items: [],
    total_amount: { type: String },
});

const Invoice = mongoose.model('invoiceDetails', invoiceDetailsSchema);

module.exports = Invoice;
