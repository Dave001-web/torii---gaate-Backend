const router = require("express").Router();
const {
  handleRegister,
  handleVerifyEmail,
  handleLogin,
  resendVerificationEmail,
} = require("../controllers/usersController");

router.post("/register", handleRegister);
router.post("/verify-email/:token", handleVerifyEmail);
router.post("/login", handleLogin);
router.post("/resend-email", resendVerificationEmail);
module.exports = router;
