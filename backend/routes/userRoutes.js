const express = require("express");
const {
  registerUser,
  loginUser,
  verifyUser,
  sendSMS,
} = require("../controllers/userController");
const router = express.Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify").post(verifyUser);
router.route("/sms").post(sendSMS);
module.exports = router;
