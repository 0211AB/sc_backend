const Company = require("../models/company");
const Product = require('../models/products')
const mongoose = require('mongoose')

exports.createCompany = async (req, res) => {
    try {
        var company = req.body
        const companyexists = await Company.find({ name: company.name });
        if (companyexists.length > 0)
            return res.status(404).json({ message: 'Client with given name already exists!!' })

        var cmpny = new Company(company);
        await cmpny.save();
        res.status(201).json({ message: "Client Created Sucessfully !!" });

    } catch (e) {
        console.log(e)
        res.status(404).json(e);
    }
};

exports.getAllCompany = async (req, res) => {
    try {
        const company = await Company.find().sort({ name: 1 });
        res
            .status(200)
            .json(company);
    } catch (e) {
        console.log(e);
        res.status(404).json(e);
    }
};

exports.updateCompany = async (req, res) => {
    try {
        const ctgy = await Company.updateOne({ _id: req.params.id }, req.body)
        res.status(201).json({ ctgy, message: "Updated Company" });

    } catch (e) {
        console.log(e)
        res.status(404).json({ e, message: "The Data You Entered Already Exists" });
    }
}

exports.addEmployee = async (req, res) => {
    try {
        const cmpny = await Company.findById(req.params.id)
        if (!cmpny)
            return res.status(404).json({ message: "Could Not Find Client" })

        cmpny.employees.push(req.body);
        await cmpny.save();

        res.status(201).json({ message: "Added employee to Client" });

    } catch (e) {
        console.log(e)
        res.status(404).json({ e, message: "Error Adding Employee To Client" });
    }
}


exports.deleteCompany = async (req, res) => {
    try {
        const CompanyId = req.params.id
        const session = await mongoose.startSession();
        session.startTransaction();

        const Company = await Company.findByIdAndDelete(CompanyId).session(session);
        if (!Company) {
            throw new Error('Company not found');
        }

        await Product.updateMany(
            { Company: CompanyId },
            { $pull: { Company: CompanyId } },
            { session: session }
        );

        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ message: "Deleted Company Successfully" });

    } catch (e) {
        console.log(e)
        session.abortTransaction();
        session.endSession();
        res.status(404).json({ e, message: "Error In Deleting Company" });
    }
}