var nodemailer = require('nodemailer');
require('dotenv').config()

const sendEmailPassReset = async (mail, resetLink) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASSWORD
        }
    });


    var mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: `${mail}`,
        subject: 'Password Reset Request for Your Account',
        html: `
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
     
  </head>
  <body style="font-family: Arial, sans-serif; text-align: center;">
      
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1>Password Reset Request</h1>
          <p>Hello,</p>
          <p>We received a request to reset your password. To reset your password, click the link below:</p>
          <a href=${resetLink} style="background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 20px; display: inline-block;">Reset Password</a>
          <p>If you did not request a password reset, please disregard this email. Your password will remain unchanged.</p>
          <p>Thank you for using our services.</p>
      </div>
      <div style="background-color: #f5f5f5; padding: 20px;">
          <p style="font-size: 12px; color: #777;">This email was sent to you in response to a password reset request. If you did not initiate this request, please contact our support team.</p>
      </div>
  </body>
  </html>
  `
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

module.exports = sendEmailPassReset;
