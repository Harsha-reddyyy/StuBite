const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    })

    console.log("MongoDB Connected ✅")
    return true

  } catch (error) {
    console.error("MongoDB Connection Failed ❌", error.message)
    return false

  }
}

const isDbConnected = () => mongoose.connection.readyState === 1

module.exports = {
  connectDB,
  isDbConnected
}
