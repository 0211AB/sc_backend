const express = require("express");
const router = new express.Router();
const controller = require("../controller/user");
const authUser = require("../middleware/authUser");

router.post("/user/signup", controller.signupUser);
router.post("/user/signin", controller.loginUser);
router.get("/user/verify", authUser,controller.verifyUser);
router.put("/user/update", authUser, controller.updateUser);


module.exports = router;