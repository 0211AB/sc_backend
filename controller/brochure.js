const Brochure = require('../models/brochure')
const Company = require('../models/company')

exports.createBrochure = async (req, res) => {
    try {
        var b = new Brochure(req.body);
        await b.save();
        res.status(201).json({ message: "Brochure Created Sucessfully !!" });

    } catch (e) {
        console.log(e)
        res.status(404).json({ e, message: 'Error in creating Brochure' });
    }
};

exports.getAllBrochure = async (req, res) => {
    try {
        const page = req.query.page ? req.query.page : 0
        const filters = {}
        if (req.query.company) {
            const company = await Company.find({ name: { $regex: new RegExp(req.query.company, 'i') } });
            const regexArray = company.map(c => c._id);
            filters['company'] = { $in: regexArray };
        }

        const brochures = await Brochure.find(filters).populate('company').populate('items.productRef').limit(15).skip(15 * page);
        const totalCount = await Brochure.countDocuments(filters);

        res
            .status(200)
            .json({ brochures, totalCount });
    } catch (e) {
        console.log(e);
        res.status(404).json({ e, message: 'Error In Fetching Brochures' });
    }
};
