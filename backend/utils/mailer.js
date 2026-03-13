const nodemailer = require("nodemailer")

const isDevResetFallbackEnabled = () =>
  process.env.ALLOW_DEV_PASSWORD_RESET === "true"

// Trimming env values avoids invisible whitespace issues when .env entries are copied manually.
const readEnv = (key) => process.env[key]?.trim()

// SMTP setup is isolated here so auth logic only worries about when to send, not how to connect.
const createTransporter = () => {
  const SMTP_HOST = readEnv("SMTP_HOST")
  const SMTP_PORT = readEnv("SMTP_PORT")
  const SMTP_USER = readEnv("SMTP_USER")
  const SMTP_PASS = readEnv("SMTP_PASS")

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in backend/.env")
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  })
}

// In development we can fall back to a console code, but production should use SMTP delivery.
const sendPasswordResetCode = async ({ email, code }) => {
  if (isDevResetFallbackEnabled() && !readEnv("SMTP_HOST")) {
    console.log(`[DEV PASSWORD RESET] ${email} -> ${code}`)
    return {
      delivery: "dev-fallback",
      debugCode: code
    }
  }

  const transporter = createTransporter()
  const fromAddress = readEnv("SMTP_FROM") || readEnv("SMTP_USER")

  await transporter.sendMail({
    from: fromAddress,
    to: email,
    subject: "StuBite password reset code",
    text: `Your StuBite verification code is ${code}. It expires in 10 minutes.`,
    html: `<p>Your StuBite verification code is <strong>${code}</strong>.</p><p>This code expires in 10 minutes.</p>`
  })

  return {
    delivery: "smtp"
  }
}

module.exports = {
  sendPasswordResetCode,
  isDevResetFallbackEnabled
}
