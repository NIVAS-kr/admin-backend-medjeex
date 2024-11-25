const nodemailer = require("nodemailer");
exports.sendEmail = async (options) => {
  try {
      var transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
          user: process.env.SMTP_MAIL,
          pass: process.env.SMTP_PASS,
        }
      });
    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};
