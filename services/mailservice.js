const nodemailer = require("nodemailer");
const { findUser } = require("../utils/finduser");
const { PrismaClient } = require("@prisma/client");
const Prisma = new PrismaClient();
const password = process.env.APP_PASSWORD;
const generateotp = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

const sendEmail = async (email, name, otp) => {
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
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        reject({ success: false, error: error });
      } else {
        resolve({ success: true });
      }
    });
  });
};

const sendSignupEmail = async (req, res, next) => {
  const { email, name } = req?.body;
  const user_info = req?.user_info;
  const user_id = req?.user_id;
  try {
    let otp = generateotp();
    const saveotp = await Prisma.otp.create({
      data: {
        user_id: user_id,
        otp,
      },
    });

    const email_response = await sendEmail(email, name, otp);

    if (email_response?.success) {
      return res.status(201).json({
        success: true,
        message: "OTP sent successfully",
        user_info: user_info,
      });
    } else {
      return res.status(500).json({
        error: email_response.error,
        message:
          "There was an error processing your request. Please try again later.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err });
  }
};

const sendLoginEmail = async (req, res, next) => {
  const { email } = req?.body;
  user_name = req.name;
  mobile_number = req.mobile_number;
  const user_info = null;
  const user_id = req.user_id;
  try {
    let otp = generateotp();
    const saveotp = await Prisma.otp.create({
      data: {
        user_id: user_id,
        otp,
      },
    });

    const email_response = await sendEmail(email, user_name, otp);
    if (email_response?.success) {
      return res.status(201).json({
        success: true,
        message: "OTP sent successfully",
      });
    } else {
      return res.status(500).json({
        error: email_response.error,
        message:
          "There was an error processing your request. Please try again later.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err });
  }
};

const verifyotp = async (req, res, next) => {
  const { user_otp, email, user_login } = req?.body;
  try {
    const user = await findUser(email);
    const latestEntry = await Prisma.otp.findFirst({
      where: {
        user_id: user?.id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (user_login && Number(user_otp) === latestEntry?.otp) {
      req.session.user = user;
      req.session.userid = user?.mobile_number;
      return res.status(200).json({
        message: "OTP matched successfully",
        user_login: true,
      });
    } else if (Number(user_otp) === latestEntry?.otp) {
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
  sendLoginEmail,
  sendSignupEmail,
  verifyotp,
};
