const express = require("express");
const router = new express.Router();
const controller = require("../controller/invoice");
const authUser = require("../middleware/authUser");

router.post("/invoice/create", authUser, controller.createInvoice);
router.get("/invoice/all", authUser, controller.getAllInvoice);
router.get("/invoice/last", authUser, controller.getLastInvoice);

module.exports = router;