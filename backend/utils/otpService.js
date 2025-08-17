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
  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Authentication OTP - Aries Leo</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background-color: #f8fafc;
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%);
          padding: 32px 24px;
          text-align: center;
        }
        .logo {
          color: #ffffff;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin: 0;
        }
        .tagline {
          color: #fce7f3;
          font-size: 14px;
          margin: 8px 0 0 0;
          font-weight: 400;
        }
        .content {
          padding: 40px 24px;
          text-align: center;
        }
        .title {
          color: #1f2937;
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 16px 0;
        }
        .message {
          color: #6b7280;
          font-size: 16px;
          margin: 0 0 32px 0;
          line-height: 1.5;
        }
        .otp-container {
          background: linear-gradient(135deg, #fef3f4 0%, #fdf2f8 100%);
          border: 2px solid #f43f5e;
          border-radius: 12px;
          padding: 24px;
          margin: 0 0 32px 0;
          display: inline-block;
          min-width: 200px;
        }
        .otp-label {
          color: #6b7280;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 8px 0;
        }
        .otp-code {
          color: #f43f5e;
          font-size: 36px;
          font-weight: 700;
          letter-spacing: 4px;
          margin: 0;
          font-family: 'Courier New', monospace;
        }
        .expiry {
          color: #ef4444;
          font-size: 14px;
          font-weight: 500;
          margin: 0 0 24px 0;
          padding: 12px 16px;
          background-color: #fef2f2;
          border-radius: 8px;
          border-left: 4px solid #ef4444;
        }
        .security-note {
          color: #6b7280;
          font-size: 14px;
          margin: 0;
          padding: 20px;
          background-color: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        .footer {
          background-color: #f9fafb;
          padding: 24px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
        .footer-text {
          color: #9ca3af;
          font-size: 12px;
          margin: 0;
        }
        .brand-link {
          color: #f43f5e;
          text-decoration: none;
          font-weight: 500;
        }
        @media only screen and (max-width: 600px) {
          .container {
            margin: 0;
            border-radius: 0;
          }
          .header {
            padding: 24px 16px;
          }
          .content {
            padding: 32px 16px;
          }
          .otp-code {
            font-size: 32px;
            letter-spacing: 3px;
          }
          .footer {
            padding: 20px 16px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="logo">ARIES LEO</h1>
          <p class="tagline">Cotton • Comfort • Confidence</p>
        </div>
        
        <div class="content">
          <h2 class="title">Verify Your Account</h2>
          <p class="message">
            We've sent you a verification code to complete your authentication. 
            Please enter the code below to continue.
          </p>
          
          <div class="otp-container">
            <p class="otp-label">Your Verification Code</p>
            <p class="otp-code">${otp}</p>
          </div>
          
          <div class="expiry">
            ⏰ This code will expire in 15 minutes
          </div>
          
          <div class="security-note">
            <strong>Security Note:</strong> Never share this code with anyone. 
            Aries Leo will never ask for your verification code via phone or email.
          </div>
        </div>
        
        <div class="footer">
          <p class="footer-text">
            This email was sent by <a href="https://ariesleo.in" class="brand-link">Aries Leo</a><br>
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `ARIES LEO <${process.env.SMTP_USER}>`,
    to: email,
    subject: "🔐 Your Aries Leo Verification Code",
    html: htmlTemplate,
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
