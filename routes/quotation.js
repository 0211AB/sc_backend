const express = require("express");
const router = new express.Router();
const controller = require("../controller/quotation");
const authUser = require("../middleware/authUser");

router.post("/quotation/create", authUser, controller.createQuotation);
router.get("/quotation/all", authUser, controller.getAllQuotation);

module.exports = router;