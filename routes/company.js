const express = require("express");
const router = new express.Router();
const controller = require("../controller/company");
const authUser = require("../middleware/authUser");

router.post("/company/create", authUser, controller.createCompany);
router.get("/company/all", authUser, controller.getAllCompany);
router.patch("/company/update/:id", authUser, controller.updateCompany);
router.patch("/company/addemployee/:id", authUser, controller.addEmployee);
router.delete("/company/delete/:id", authUser, controller.deleteCompany);

module.exports = router;