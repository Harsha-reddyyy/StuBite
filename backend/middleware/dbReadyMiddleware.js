const { isDbConnected } = require("../config/db")

const dbReadyMiddleware = (req, res, next) => {
  if (!isDbConnected()) {
    return res.status(503).json({
      message: "Database unavailable. Check MongoDB Atlas connection and try again."
    })
  }

  next()
}

module.exports = dbReadyMiddleware
