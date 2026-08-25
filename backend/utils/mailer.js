const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEventNotification = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: `"Event Planning" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent
    });
  } catch (error) {
    console.error('Email Notification Error:', error);
  }
};

module.exports = sendEventNotification;