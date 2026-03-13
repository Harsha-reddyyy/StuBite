const mongoose = require("mongoose")

// We return a boolean here so server startup can report DB health without crashing the whole app.
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

// Route guards rely on this helper before allowing database-backed requests through.
const isDbConnected = () => mongoose.connection.readyState === 1

module.exports = {
  connectDB,
  isDbConnected
}
