const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const { sendPasswordResetCode, isDevResetFallbackEnabled } = require("../utils/mailer")

const EMAIL_REGEX = /^\S+@\S+\.\S+$/
const PASSWORD_RESET_CODE_TTL_MS = 10 * 60 * 1000

const normalizeEmail = (email = "") => email.trim().toLowerCase()
const hashResetCode = (code) =>
  crypto.createHash("sha256").update(code).digest("hex")

const buildAuthResponse = (user) => {
  const token = jwt.sign(
    {id:user._id},
    process.env.JWT_SECRET || "secret123",
    {expiresIn:"7d"}
  )

  return {
    token,
    user:{
      id:user._id,
      name:user.name,
      email:user.email
    }
  }
}

const clearPasswordResetState = async (user) => {
  user.passwordResetCodeHash = null
  user.passwordResetExpiresAt = null
  await user.save()
}

exports.registerUser = async (req,res)=>{
  try{
    const name = req.body.name?.trim()
    const email = normalizeEmail(req.body.email)
    const password = req.body.password?.trim()

    if (!name || !email || !password) {
      return res.status(400).json({message:"Name, email, and password are required"})
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({message:"Please enter a valid email address"})
    }

    if (password.length < 6) {
      return res.status(400).json({message:"Password must be at least 6 characters long"})
    }

    const existingUser = await User.findOne({email})
    if(existingUser){
      return res.status(400).json({message:"User already exists"})
    }

    const hashedPassword = await bcrypt.hash(password,10)
    const user = await User.create({
      name,
      email,
      password:hashedPassword
    })

    res.status(201).json(buildAuthResponse(user))

  }catch(error){
    if (error.code === 11000) {
      return res.status(400).json({message:"User already exists"})
    }

    res.status(500).json({message:error.message})
  }
}

exports.loginUser = async (req,res)=>{
  try{
    const email = normalizeEmail(req.body.email)
    const password = req.body.password?.trim()

    if (!email || !password) {
      return res.status(400).json({message:"Email and password are required"})
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({message:"Please enter a valid email address"})
    }

    const user = await User.findOne({email})

    if(!user){
      return res.status(400).json({message:"Invalid email or password"})
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
      return res.status(400).json({message:"Invalid email or password"})
    }

    res.json(buildAuthResponse(user))

  }catch(error){
    res.status(500).json({message:error.message})
  }
}

exports.requestPasswordReset = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email)

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.json({
        message: "If an account exists for this email, a verification code has been sent."
      })
    }

    const code = String(Math.floor(100000 + Math.random() * 900000))
    user.passwordResetCodeHash = hashResetCode(code)
    user.passwordResetExpiresAt = new Date(Date.now() + PASSWORD_RESET_CODE_TTL_MS)
    await user.save()

    try {
      const delivery = await sendPasswordResetCode({ email, code })

      if (delivery?.delivery === "dev-fallback") {
        return res.json({
          message: "Verification code generated locally. Check the backend console.",
          debugCode: delivery.debugCode
        })
      }
    } catch (error) {
      await clearPasswordResetState(user)
      console.error("Password reset email failed:", error.message)

      if (error.message.includes("SMTP is not configured")) {
        return res.status(503).json({
          message: "Password reset email is unavailable. Configure SMTP in backend/.env and try again."
        })
      }

      if (isDevResetFallbackEnabled()) {
        console.log(`[DEV PASSWORD RESET FALLBACK] ${email} -> ${code}`)
        return res.status(200).json({
          message: "Email delivery failed, so a local verification code was generated. Check the backend console.",
          debugCode: code
        })
      }

      return res.status(502).json({
        message: `Could not send the verification email right now. ${error.message}`
      })
    }

    res.json({
      message: "Verification code sent to your email."
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email)
    const code = req.body.code?.trim()
    const newPassword = req.body.newPassword?.trim()

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: "Email, verification code, and new password are required" })
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" })
    }

    const user = await User.findOne({ email })

    if (!user || !user.passwordResetCodeHash || !user.passwordResetExpiresAt) {
      return res.status(400).json({ message: "Invalid or expired verification code" })
    }

    if (user.passwordResetExpiresAt.getTime() < Date.now()) {
      await clearPasswordResetState(user)
      return res.status(400).json({ message: "Verification code expired. Please request a new one." })
    }

    const isCodeValid = user.passwordResetCodeHash === hashResetCode(code)

    if (!isCodeValid) {
      return res.status(400).json({ message: "Invalid or expired verification code" })
    }

    user.password = await bcrypt.hash(newPassword, 10)
    user.passwordResetCodeHash = null
    user.passwordResetExpiresAt = null
    await user.save()

    res.json({
      message: "Password updated successfully. Please log in with your new password."
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
