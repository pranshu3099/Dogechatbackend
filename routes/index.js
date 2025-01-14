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
const cors_obj = {
  origin: get_frontend_url(),
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
router.use(cors(cors_obj));

// router.get("/", (req, res) => {
//   res.send("welcome to dogechat");
// });

router.post(
  "/doge/dogechat/register",
  validate({ body: registerSchema }),
  userRegister,
  sendSignupEmail
);

router.post(
  "/doge/dogechat/login",
  validate({ body: validateEmail }),
  userLogin,
  sendLoginEmail
);

router.get("/doge/dogechat/checkvalidity", isLoggedin);

router.post(
  "/doge/dogechat/verifyotp",
  validate({ body: verifyotplength }),
  verifyotp
);

router.post("/doge/dogechat/uploadimage", upload.array("images"), uploadImage);

module.exports = router;
