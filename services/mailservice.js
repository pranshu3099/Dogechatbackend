const nodemailer = require("nodemailer");
const { findUser } = require("../utils/finduser");
const { PrismaClient } = require("@prisma/client");
const Prisma = new PrismaClient();
const password = process.env.APP_PASSWORD;
const generateotp = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

const sendEmail = async (req, res, next) => {
  const { email, mobile_number, user_info, name } = req?.body;
  try {
    let otp = generateotp();
    const user = await findUser(mobile_number);
    const saveotp = await Prisma.otp.create({
      data: {
        user_id: user?.id,
        otp,
      },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "srivastavapranshu2@gmail.com",
        pass: password,
      },
    });

    const mailOptions = {
      from: "srivastavapranshu2@gmail.com",
      to: `${email}`,
      subject: "otp for login",
      text: `hi ${name} your otp for logging in dogechat is ${otp} `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        return res.status(201).json({
          success: true,
          message: "OTP sent successfully",
          user_info: user_info,
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err });
  }
};

const verifyotp = async (req, res, next) => {
  const { user_otp, mobile_number } = req?.body;
  console.log(user_otp, mobile_number);
  try {
    const user = await findUser(mobile_number);
    const latestEntry = await Prisma.otp.findFirst({
      where: {
        user_id: user?.id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (Number(user_otp) === latestEntry?.otp) {
      return res
        .status(200)
        .json({ message: "OTP matched successfully", success: true });
    } else {
      return res.status(401).json({ message: "Invalid OTP", success: false });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "internal server error", error: err });
  }
};

module.exports = {
  sendEmail,
  verifyotp,
};
