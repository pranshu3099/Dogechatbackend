const { PrismaClient } = require("@prisma/client");
const Prisma = new PrismaClient();
const express = require("express");
const router = express.Router();
const { findUser } = require("../utils/finduser");

const userRegister = async (req, res, next) => {
  try {
    const { name, mobile_number } = req?.body;

    const user = await Prisma.users.findFirst({
      where: {
        mobile_number,
      },
    });

    if (!user) {
      return res.status(409).json({
        error: "Conflict",
        message: "User with the provided mobile_number already exists.",
      });
    } else {
      await Prisma.users.create({
        data: {
          name: name,
          mobile_number: mobile_number,
        },
      });
      // sendOtp(mobile_number);
      req.mobile_number = mobile_number;
      next();
      return res.status(201).json({
        message: "user created sucessfully",
        success: true,
        otp_message: "OTP sent successfully",
      });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
};

const userLogin = async (req, res, next) => {
  const { mobile_number } = req?.body;
  try {
    const user = await findUser(mobile_number);
    if (user) {
      req.session.user = user;
      req.session.userid = user?.mobile_number;
      console.log(req.sessionID);
      return res
        .status(200)
        .json({ message: "successfully loggedin", success: true, user: user });
    } else {
      return res.status(401).json({
        message: "Authentication failed: User not registered",
      });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
};

const isLoggedin = (req, res) => {
  try {
    const user = req.session.user;
    console.log(user);
    if (user) {
      return res.status(200).json({ success: true, user: user });
    } else {
      return res.status(401).json({ success: false });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
};

module.exports = { userRegister, userLogin, isLoggedin };
