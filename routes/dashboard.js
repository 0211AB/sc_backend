const express = require("express");
const router = new express.Router();
const controller = require("../controller/dashboard");
const authUser = require("../middleware/authUser");

router.get("/dashboard/details", authUser, controller.getDetails);

module.exports = router;