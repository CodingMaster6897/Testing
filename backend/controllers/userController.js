const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const comparePassword = require("../utils/comparePassword");
const generateOTP = require("../utils/generateOtp");
const Owner = require("../models/ownerModel");
const sendSms = require("../utils/generateSMS");
const sendMail = require("../utils/generateEmail");
const registerUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const userExists = await User.findOne({ email: req.body.email });
  const userPhoneExists = await User.findOne({ phone: req.body.phone });
  const otp = generateOTP();
  if (userExists || userPhoneExists) {
    return res.status(401).json({ message: "User exists" });
  }
  const hashedPassword = await bcrypt.hash(req.body.pass, 10);
  const newUser = await User.create({
    ...req.body,
    otp: otp,
    password: hashedPassword,
  });
  //Send Otp Mobile number
  const smsStatus = await sendSms(req.body.phone, otp);
  if (smsStatus === 200) {
    return res.status(200).json({ message: " Otp sent successfully" });
  } else {
    return res.status(smsStatus).json({ message: "Failed to send Otp" });
  }
  //Send Otp email
  // await sendMail(req.body.email, otp);
  // return res.status(200).json({ message: " Otp sent successfully" });
});
const verifyUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const userPhoneExists = await User.findOne({ phone: req.body.phone });

  if (!user || !userPhoneExists) {
    return res.status(401).json({ message: "User not found" });
  }

  // const { otp: userOtp, otpExpiresAt } = user.emailVerification;

  if (req.body.otp !== user.otp) {
    return res.status(401).json({ message: "Invalid OTP" });
  }
  user.verified = true;
  user.otp = "";
  await user.save();

  // Generate JWT token
  const { pass, ...others } = user._doc;
  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    {
      expiresIn: "5h",
    }
  );

  return res.status(200).json({ others, token });
});
const loginUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const phone = req.body.phone;
  const password = req.body.password;
  const user = await User.findOne({ phone: phone });
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const comparePass = await comparePassword(password, user.password);
  if (!comparePass) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "5h",
  });

  return res.status(200).json({ token });
});

const sendSMS = async (req, res) => {
  console.log(req.body);
  // var options = {
  //   authorization:
  //     "3EOazDtNpnjioDEY7Ma4G8Ym4QjAn3AhGTHtorD1S9BrVK0o7rsIMgJpqIPg",
  //   message: `Your OTP for Kreedy app verification is ${req.body.message}.`,
  //   numbers: ["9970036897"],
  // };
  try {
    const response = await fast2sms({
      message: `Your OTP is ${req.body.message}`,
      contactNumber: req.body.phone,
    });
    console.log(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to send SMS message" });
  }
};

module.exports = { registerUser, loginUser, verifyUser, sendSMS };
