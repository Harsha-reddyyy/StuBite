const nodemailer = require("nodemailer")

const isDevResetFallbackEnabled = () =>
  process.env.ALLOW_DEV_PASSWORD_RESET === "true"

const readEnv = (key) => process.env[key]?.trim()

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
