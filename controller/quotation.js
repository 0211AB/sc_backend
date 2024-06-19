const Quotation = require("../models/quotation");
const Company = require('../models/company')

exports.createQuotation = async (req, res) => {
    try {
        var quotation = new Quotation(req.body);
        await quotation.save();
        res.status(201).json({ message: "Quotation Created Sucessfully !!" });

    } catch (e) {
        console.log(e)
        res.status(404).json({ e, message: 'Error in creating Quotation' });
    }
};

exports.getAllQuotation = async (req, res) => {
    try {
        const page = req.query.page ? req.query.page : 0
        const filters = {}
        if (req.query.company) {
            const company = await Company.find({ name: { $regex: new RegExp(req.query.company, 'i') } });
            const regexArray = company.map(c => new RegExp(`^${c.name}`, 'i'));
            filters['company'] = { $in: regexArray };
        }

        const quotation = await Quotation.find(filters).limit(15).skip(15 * page);
        const totalCount = await Quotation.countDocuments(filters);

        res
            .status(200)
            .json({ quotation, totalCount });
    } catch (e) {
        console.log(e);
        res.status(404).json({ e, message: 'Error In Fetching Quotations' });
    }
};

exports.getQuotationById = async (req, res) => {
    try {
        const { id } = req.params
        const quotation = await Quotation.findById(id)

        res.status(200).json(quotation);
    } catch (e) {
        console.log(e);
        res.status(404).json({ e, message: 'Could Not Fetch Quotations' });
    }
};

exports.updateQuotation = async (req, res) => {
    try {
        const { id } = req.params

        const prevQuotation = await Quotation.findById(id);
        if (!prevQuotation)
            return res.status(404).json({ message: 'Quotation with given ID not found' })
        const updatedq = await Quotation.findByIdAndUpdate(id, req.body, { new: true })
        return res.status(200).json({ quotation: updatedq, message: 'Quotation Updated Sucessfully' })

    } catch (e) {
        console.log(e)
        res.status(404).json({ e, message: "Error updating Quotation" });
    }
}
