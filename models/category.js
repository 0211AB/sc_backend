const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Name is Required']
    },
});

const Category = new mongoose.model("category", CategorySchema);

module.exports = Category;