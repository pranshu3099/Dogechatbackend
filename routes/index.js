const express = require("express");
const router = express.Router();
const cors = require("cors");
const Cookies = require("cookies");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const {
  registerSchema,
  verifyotplength,
  validateMobilenumber,
} = require("../schema/schema");
const { validate } = require("../middleware/validate");
const {
  userRegister,
  userLogin,
  isLoggedin,
} = require("../controller/AuthController");
const { sendEmail, verifyotp } = require("../services/mailservice");
const { uploadImage } = require("../controller/ImageController");
router.use(Cookies.express([""]));
router.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
router.post(
  "/dogechat/register",
  validate({ body: registerSchema }),
  userRegister,
  sendEmail
);

router.post(
  "/dogechat/login",
  validate({ body: validateMobilenumber }),
  userLogin
);

router.get("/dogechat/checkvalidity", isLoggedin);

router.post(
  "/dogechat/verifyotp",
  validate({ body: verifyotplength }),
  verifyotp
);

router.post("/api/uploadimage", upload.array("images"), uploadImage);

module.exports = router;
