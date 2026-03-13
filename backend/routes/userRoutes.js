const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const dbReadyMiddleware = require("../middleware/dbReadyMiddleware")
const {
  getCurrentUser,
  updateProfile,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  clearDefaultAddress,
  createOrder,
  getOrders,
  getCart,
  replaceCart
} = require("../controllers/userController")

const router = express.Router()

// User routes are both database-backed and identity-protected, so we stack those guards up front.
router.use(dbReadyMiddleware)
router.use(authMiddleware)

router.get("/me", getCurrentUser)
router.put("/me", updateProfile)

router.get("/orders", getOrders)
router.post("/orders", createOrder)
router.get("/cart", getCart)
router.put("/cart", replaceCart)

router.post("/addresses", createAddress)
router.put("/addresses/:addressId", updateAddress)
router.patch("/addresses/:addressId/default", setDefaultAddress)
router.patch("/addresses/:addressId/default/remove", clearDefaultAddress)
router.delete("/addresses/:addressId", deleteAddress)

module.exports = router
