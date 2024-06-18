const Category = require("../models/category");
const Product = require('../models/products')
const mongoose = require('mongoose')
const cloudinary = require('cloudinary').v2;

exports.createProduct = async (req, res) => {
    try {
        const {
            name,
            company,
            category,
            description,
            materials,
            colors,
            cost_price,
            cost_price_inclusive_tax,
            gst,
            hsn_code,
            images
        } = req.body;
        const cloudinaryUrls = [];

        for (const image of images) {
            const result = await cloudinary.uploader.upload(image, {
                folder: 'saraff_creations'
            });
            cloudinaryUrls.push(result.secure_url);
        }

        const newProduct = new Product({
            name,
            images: cloudinaryUrls,
            company,
            category,
            description,
            materials,
            colors,
            cost_price,
            cost_price_inclusive_tax,
            gst,
            hsn_code
        });

        await newProduct.save();

        res.status(201).json({ message: "Category Created Sucessfully !!" });

    } catch (e) {
        console.log(e)
        res.status(404).json({ e, message: 'Error adding a new product' });
    }
};

exports.getAllProduct = async (req, res) => {
    try {
        const page = req.query.page ? req.query.page : 0
        const filters = {}
        if (req.query.name) {
            filters['name'] = { $regex: new RegExp(req.query.name, 'i') };
        }

        if (req.query.company) {
            filters['company'] = { $regex: new RegExp(req.query.company, 'i') };
        }

        if (req.query.selectedCategories) {
            const selectedCategoryIdsArray = req.query.selectedCategories.split(',')
            filters['category'] = { $in: selectedCategoryIdsArray };
        }

        const product = await Product.find(filters).select('name images company category description').populate('category', 'name').limit(15).skip(15 * page);

        const formattedProducts = product.map((product) => ({
            _id: product._id,
            image: product.images.length > 0 ? product.images[0] : '',
            name: product.name,
            category: product.category.map((cat) => cat.name),
            company: product.company,
            description: product.description,
        }));

        const totalCount = await Product.countDocuments(filters);

        res.status(200).json({ products: formattedProducts, totalCount });
    } catch (e) {
        console.log(e);
        res.status(404).json({ e, message: 'Could Not Fetch Products' });
    }
};

exports.getAllProductNoFilter = async (req, res) => {
    try {
        const product = await Product.find()
        res.status(200).json(product);
    } catch (e) {
        console.log(e);
        res.status(404).json({ e, message: 'Could Not Fetch Products' });
    }
};


exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id).populate('category', 'name')

        res.status(200).json(product);
    } catch (e) {
        console.log(e);
        res.status(404).json({ e, message: 'Could Not Fetch Products' });
    }
};


exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const {
            name,
            company,
            category,
            description,
            materials,
            colors,
            cost_price,
            cost_price_inclusive_tax,
            gst,
            hsn_code,
            images
        } = req.body;

        const prevProduct = await Product.findById(id);
        if (!prevProduct)
            return res.status(404).json({ message: 'Product with given ID not found' })

        prevProduct.name = name;
        prevProduct.cost_price = cost_price
        prevProduct.company = company
        prevProduct.category = category
        prevProduct.description = description
        prevProduct.materials = materials
        prevProduct.colors = colors
        prevProduct.cost_price_inclusive_tax = cost_price_inclusive_tax
        prevProduct.gst = gst
        prevProduct.hsn_code = hsn_code

        //previmages array is of urls,now i will get urls and dataurls. data urls need to be uploaded to cloudinary and saved and if something is not thre which was there previously,delete it from cloudinary

        const prevImages = prevProduct.images;
        const urlsToDelete = prevImages.filter(url => !images.includes(url));
        const dataUrls = images.filter(image => image.startsWith('data:image'));

        const uploadPromises = dataUrls.map(async (dataUrl) => {
            const uploadResponse = await cloudinary.uploader.upload(dataUrl, {
                folder: 'saraff_creations'
            });
            return uploadResponse.secure_url;
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        const finalImages = images.filter(image => !image.startsWith('data:image')).concat(uploadedUrls);

        const deletePromises = urlsToDelete.map(async (url) => {
            const publicId = url.split('/').pop().split('.')[0];
            return await cloudinary.uploader.destroy(`saraff_creations/${publicId}`);
        });

        await Promise.all(deletePromises);

        prevProduct.images = finalImages;

        await prevProduct.save();

        return res.status(200).json({ message: 'Product Updated Sucessfully' })

    } catch (e) {
        console.log(e)
        res.status(404).json({ e, message: "Error updating product" });
    }
}

exports.deleteProduct = async (req, res) => {
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