const { PrismaClient } = require("@prisma/client");
const Prisma = new PrismaClient();
const { findUser } = require("../utils/finduser");
const twilio = require("twilio");
const generateotp = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

const sendOtp = async (req, res, next) => {
  const mobile_number = req.mobile_number;
  let otp = generateotp();
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
  const client = new twilio(accountSid, authToken);

  const user = await findUser(mobile_number);
  await Prisma.otp.create({
    data: {
      user_id: user?.id,
      otp,
    },
  });

  client.messages
    .create({
      body: `your otp is:${otp}`,
      from: twilioPhone,
      to: `+91${mobile_number}`,
    })
    .then(() => {
      // res.json({ success: true, message: "OTP sent successfully" });
      console.log("otp send successfully");
    })
    .catch((error) => {
      console.error(error);
      // res.status(500).json({ error: "Failed to send OTP" });
    });
};

const verifyotp = async (req, res, next) => {
  const { user_otp, mobile_number } = req?.body;
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

module.exports = { sendOtp, verifyotp };
