const Category = require("../models/category");
const Product = require('../models/products')
const mongoose = require('mongoose')

exports.createCategory = async (req, res) => {
    try {
        var category = req.body
        var ctgy = new Category(category);
        await ctgy.save();
        res.status(201).json({ message: "Category Created Sucessfully !!" });

    } catch (e) {
        console.log(e)
        res.status(404).json(e);
    }
};

exports.getAllCategory = async (req, res) => {
    try {
        const ctgy = await Category.find();
        res
            .status(200)
            .json(ctgy);
    } catch (e) {
        console.log(e);
        res.status(404).json(e);
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const ctgy = await Category.updateOne({ _id: req.params.id }, req.body)
        res.status(201).json({ ctgy, message: "Updated Category" });

    } catch (e) {
        console.log(e)
        res.status(404).json({ e, message: "The Data You Entered Already Exists" });
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id
        const session = await mongoose.startSession();
        session.startTransaction();

        const category = await Category.findByIdAndDelete(categoryId).session(session);
        if (!category) {
            throw new Error('Category not found');
        }

        await Product.updateMany(
            { category: categoryId },
            { $pull: { category: categoryId } },
            { session: session }
        );

        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ message: "Deleted Category Successfully" });

    } catch (e) {
        console.log(e)
        session.abortTransaction();
        session.endSession();
        res.status(404).json({ e, message: "Error In Deleting Category" });
    }
}