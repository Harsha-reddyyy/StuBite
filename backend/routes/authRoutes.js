const express = require("express")
const router = express.Router()
const dbReadyMiddleware = require("../middleware/dbReadyMiddleware")

const {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword
} = require("../controllers/authController")

// Auth depends on MongoDB, so we block these routes early if the database is down.
router.use(dbReadyMiddleware)

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/forgot-password", requestPasswordReset)
router.post("/reset-password", resetPassword)

module.exports = router
