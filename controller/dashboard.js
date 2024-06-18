const Brochure = require('../models/brochure')
const Company = require('../models/company')
const Invoice = require("../models/invoice");
const Category = require("../models/category");
const Product = require('../models/products')

exports.getDetails = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalInvoices = await Invoice.countDocuments();
        const totalBrochures = await Brochure.countDocuments();
        const totalClients = await Company.countDocuments();

        const result = await Product.aggregate([
            {
                $unwind: "$category"
            },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            {
                $unwind: "$categoryDetails"
            },
            {
                $project: {
                    _id: 0,
                    categoryName: "$categoryDetails.name",
                    productCount: "$count"
                }
            }
        ]);

        return res.status(200).json({ totalBrochures, totalClients, totalInvoices, totalProducts, categoryData: result })
    } catch (e) {
        console.log(e)
        res.status(404).json({ e, message: 'Error in getting dashboard details' });
    }
}