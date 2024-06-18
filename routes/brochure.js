const express = require("express");
const router = new express.Router();
const controller = require("../controller/brochure");
const authUser = require("../middleware/authUser");

router.post("/brochure/create", authUser, controller.createBrochure);
router.get("/brochure/all", authUser, controller.getAllBrochure);

module.exports = router;