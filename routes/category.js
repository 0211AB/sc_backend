const express = require("express");
const router = new express.Router();
const controller = require("../controller/category");
const authUser = require("../middleware/authUser");

router.post("/category/create", authUser, controller.createCategory);
router.get("/category/all", authUser, controller.getAllCategory);
router.put("/category/update/:id", authUser, controller.updateCategory);
router.delete("/category/delete/:id", authUser, controller.deleteCategory);

module.exports = router;