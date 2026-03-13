const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const authRoutes = require("./routes/authRoutes");
const catalogRoutes = require("./routes/catalogRoutes");
const userRoutes = require("./routes/userRoutes");

const { connectDB, isDbConnected } = require("./config/db");

const app = express();

/* ---------------- CORS ---------------- */

// Localhost and 127.0.0.1 are both allowed so the frontend still works across different dev setups.
const allowedOriginPatterns = [
  /^http:\/\/localhost:\d+$/,
  /^http:\/\/127\.0\.0\.1:\d+$/
];

const corsOptions = {
  origin(origin, callback) {
    if (
      !origin ||
      allowedOriginPatterns.some((pattern) => pattern.test(origin))
    ) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  // Browsers send preflight OPTIONS calls before some requests, so we finish those early.
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

/* ---------------- MIDDLEWARE ---------------- */

app.use(express.json());

/* ---------------- ROUTES ---------------- */

// Public catalog routes come first, then auth, then JWT-protected user APIs.
app.use("/api", catalogRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

/* ---------------- ROOT ---------------- */

app.get("/", (req, res) => {
  res.send("StuBite Backend Running 🚀");
});

/* ---------------- HEALTH ---------------- */

app.get("/health", (req, res) => {
  res.json({
    server: "up",
    database: isDbConnected() ? "connected" : "disconnected"
  });
});

/* ---------------- SERVER ---------------- */

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// We start listening immediately, then report DB state separately so health checks stay reachable.
connectDB()
  .then((connected) => {
    if (connected) {
      console.log("✅ Database connected");
    } else {
      console.error("❌ Database unavailable");
    }
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
  });
