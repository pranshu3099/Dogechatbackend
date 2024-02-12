const { mobileRegex, emailRegex, otpRegex } = require("../Regex/regex");

const { z, string } = require("zod");

const registerSchema = z.object({
  name: string().min(5).max(100),
  mobile_number: string()
    .min(10)
    .max(10)
    .regex(mobileRegex, { message: "Invalid mobile number" }),
  email: string().max(100).regex(emailRegex, { message: "Invalid email" }),
});

const verifyotplength = z.object({
  user_otp: string()
    .min(4)
    .max(4)
    .regex(otpRegex, { message: "otp must be of 4 digits" }),
});

const validateMobilenumber = z.object({
  mobile_number: string().min(10).max(10).regex(mobileRegex),
});

const validateEmail = z.object({
  email: string().max(100).regex(emailRegex, { message: "Invalid email" }),
});

module.exports = {
  registerSchema,
  verifyotplength,
  validateMobilenumber,
  validateEmail,
};
