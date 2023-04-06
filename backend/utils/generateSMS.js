const axios = require("axios");

const sendSms = async (phone, otp) => {
  const apiKey = "c5153cf4-ca6b-11ed-81b6-0200cd936042";

  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://2factor.in/API/V1/${apiKey}/SMS/${phone}/${otp}/OTP1`,
    headers: {},
  };

  try {
    const response = await axios(config);
    console.log(JSON.stringify(response.data));
    console.log("OTP sent successfully");
    return response.status;
  } catch (error) {
    console.log(error);
    console.log("Some error occured");
    return 500; // Default error status
  }
};

module.exports = sendSms;
