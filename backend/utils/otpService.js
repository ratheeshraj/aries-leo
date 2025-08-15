const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

async function sendOtpEmail(email, otp) {
  const mailOptions = {
    from: `ARIES LEO <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Authentication OTP",
    html: `<p>Your authentication OTP is <strong>${otp}</strong>.</p>
           <p>This OTP will expire in 10 minutes.</p>`,
  };
  return transporter.sendMail(mailOptions);
}

async function assignAndSendOtp(user) {
  const otp = generateOtp();
  const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  await sendOtpEmail(user.email, otp);
}

module.exports = {
  generateOtp,
  sendOtpEmail,
  assignAndSendOtp,
};
