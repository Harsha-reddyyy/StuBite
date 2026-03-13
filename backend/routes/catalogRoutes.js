const express = require("express")
const {
  getCanteens,
  getCanteenMenu
} = require("../controllers/catalogController")

const router = express.Router()

// Catalog endpoints stay public because users should be able to browse before logging in.
router.get("/canteens", getCanteens)
router.get("/canteens/:canteenSlug/menu", getCanteenMenu)

module.exports = router
