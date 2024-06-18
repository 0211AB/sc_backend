const Invoice = require("../models/invoice");
const Company = require('../models/company')

exports.createInvoice = async (req, res) => {
    try {
        var invoice = new Invoice(req.body);
        await invoice.save();
        res.status(201).json({ message: "Invoice Created Sucessfully !!" });

    } catch (e) {
        console.log(e)
        res.status(404).json({ e, message: 'Error in creating Invoice' });
    }
};

exports.getLastInvoice = async (req, res) => {
    try {
        var lastInvoice = await Invoice.findOne().sort({ _id: -1 });
        const currentYear = new Date().getFullYear();
        const academicYear = `${currentYear}-${(currentYear % 100) + 1}/INV-`;
        if (!lastInvoice)
            throw new Error(academicYear)
        let numberString = lastInvoice.number.split("-")[2];
        let number = parseInt(numberString);
        let nextNumber = number + 1;
        let nextNumberString = nextNumber.toString().padStart(3, '0');
        const invoiceNumber = academicYear + nextNumberString
        res.status(201).json(invoiceNumber);

    } catch (e) {
        console.log(e)
        const currentYear = new Date().getFullYear();
        const academicYear = `${currentYear}-${(currentYear % 100) + 1}/INV-`;
        res.status(404).json({ inv: academicYear, message: 'Error in fetching invoice id' });
    }
};

exports.getAllInvoice = async (req, res) => {
    try {
        const page = req.query.page ? req.query.page : 0
        const filters = {}
        if (req.query.company) {
            const company = await Company.find({ name: { $regex: new RegExp(req.query.company, 'i') } });
            const regexArray = company.map(c => new RegExp(`^${c.name}`, 'i'));
            filters['company'] = { $in: regexArray };
        }

        const invoice = await Invoice.find(filters).populate('items.id').limit(15).skip(15 * page);
        const totalCount = await Invoice.countDocuments(filters);

        res
            .status(200)
            .json({ invoice, totalCount });
    } catch (e) {
        console.log(e);
        res.status(404).json({ e, message: 'Error In Fetching Invoices' });
    }
};
