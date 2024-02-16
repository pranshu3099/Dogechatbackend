const express = require("express");
const router = express.Router();
const cors = require("cors");
const Cookies = require("cookies");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
function get_frontend_url() {
  const frontend_url = process.env.FRONTEND_URL;
  return frontend_url;
}
const {
  registerSchema,
  verifyotplength,
  validateMobilenumber,
  validateEmail,
} = require("../schema/schema");
const { validate } = require("../middleware/validate");
const {
  userRegister,
  userLogin,
  isLoggedin,
} = require("../controller/AuthController");
const {
  sendLoginEmail,
  sendSignupEmail,
  verifyotp,
} = require("../services/mailservice");
const { uploadImage } = require("../controller/ImageController");
router.use(Cookies.express([""]));
const obj = {
  origin: get_frontend_url(),
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
console.log(obj);
router.use(cors(obj));
router.post(
  "/dogechat/register",
  validate({ body: registerSchema }),
  userRegister,
  sendSignupEmail
);

router.post(
  "/dogechat/login",
  validate({ body: validateEmail }),
  userLogin,
  sendLoginEmail
);

router.get("/dogechat/checkvalidity", isLoggedin);

router.post(
  "/dogechat/verifyotp",
  validate({ body: verifyotplength }),
  verifyotp
);

router.post("/dogechat/uploadimage", upload.array("images"), uploadImage);

module.exports = router;
