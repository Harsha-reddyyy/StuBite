const { isDbConnected } = require("../config/db")

// This keeps database-backed routes from failing noisily when Atlas is unavailable.
const dbReadyMiddleware = (req, res, next) => {
  if (!isDbConnected()) {
    return res.status(503).json({
      message: "Database unavailable. Check MongoDB Atlas connection and try again."
    })
  }

  next()
}

module.exports = dbReadyMiddleware
