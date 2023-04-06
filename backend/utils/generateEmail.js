const nodemailer = require("nodemailer");
const sendMail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASS,
    },
    secure: true,
  });
  const mailData = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Verify your email address for Kreedy app",
    text: `Your OTP for email verification is ${otp}.`,
  };
  transporter.sendMail(mailData, function (err, info) {
    if (err) console.log(err);
  });
};
module.exports = sendMail;
