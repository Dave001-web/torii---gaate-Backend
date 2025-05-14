const router = require("express").Router();
const { handleRegister, handleVerifyEmail } = require("../controllers/usersController")

router.post ("/register", handleRegister)
router.post ("/verify-email/:token", handleVerifyEmail)

module.exports = router
