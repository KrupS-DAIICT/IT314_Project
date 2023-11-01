var nodemailer = require('nodemailer');
require('dotenv').config()
const sendmail = async (mail,otp) => {
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_EMAIL_ID,
    pass: process.env.SENDER_EMAIL_PASSWORD
  }
});


var mailOptions = {
  from: process.env.SENDER_EMAIL_ID,
  to: `${mail}`,
  subject: 'Sending Email using Node.js',
  html: `<html lang="en">

  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          /* Reset some default styles */
          body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              text-align: center;
              background-color: #f4f4f4;
          }
  
          /* Main email container */
          .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
          }
  
          /* Header styles */
          .header {
              font-size: 24px;
              font-weight: bold;
          }
  
          /* OTP styles */
          .otp {
              font-size: 32px;
              color: #007bff;
          }
  
          /* Disclaimer text */
          .disclaimer {
              font-size: 12px;
              color: #888;
          }
      </style>
  </head>
  
  <body>
      <div class="container">
          <div class="header">Welcome to Our Website</div>
          <p>Thank you for signing up. To complete your registration, please enter the following OTP:</p>
          <!-- OTP placeholder -->
          <div class="otp">${otp}</div>
          <p>This OTP is valid for a single use and should be entered within a specific time frame.</p>
          <p>If you did not sign up for an account on our website, please disregard this email.</p>
          <p class="disclaimer">This is an automated email, please do not reply.</p>
      </div>
  </body>
  
  </html>`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}




module.exports=sendmail;
