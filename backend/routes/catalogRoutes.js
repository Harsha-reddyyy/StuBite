const express = require("express")
const {
  getCanteens,
  getCanteenMenu
} = require("../controllers/catalogController")

const router = express.Router()

router.get("/canteens", getCanteens)
router.get("/canteens/:canteenSlug/menu", getCanteenMenu)

module.exports = router
