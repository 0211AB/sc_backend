const express = require("express");
const router = new express.Router();
const controller = require("../controller/quotation");
const authUser = require("../middleware/authUser");

router.post("/quotation/create", authUser, controller.createQuotation);
router.get("/quotation/all", authUser, controller.getAllQuotation);
router.get("/quotation/one/:id", authUser, controller.getQuotationById);
router.patch("/quotation/update/:id", authUser, controller.updateQuotation);

module.exports = router;