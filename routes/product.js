const express = require("express");
const router = new express.Router();
const controller = require("../controller/product");
const authUser = require("../middleware/authUser");

router.post("/product/create", authUser, controller.createProduct);
router.get("/product/all", authUser, controller.getAllProduct);
router.get("/product/all-nofilters", authUser, controller.getAllProductNoFilter);
router.get("/product/one/:id", authUser, controller.getProductById);
router.patch("/product/edit/:id", authUser, controller.updateProduct);
router.delete("/product/delete/:id", authUser, controller.deleteProduct);

module.exports = router;