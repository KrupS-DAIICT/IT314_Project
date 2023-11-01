var nodemailer = require('nodemailer');
require('dotenv').config()
const sendmail_accountlock = async (mail,resetLink) => {
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
  subject: 'Your Accout is Locked',
  html : `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          text-align: center;
        }
        h1 {
          color: #333;
        }
        p {
          color: #555;
        }
        a {
          display: inline-block;
          margin: 10px;
          padding: 10px 20px;
          background-color: #007BFF;
          color: #fff;
          text-decoration: none;
        }
        a:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <h1>Account Locked</h1>
      <p>Your account has been temporarily locked for security reasons.</p>
      <p>To unlock your account, please click the following link:</p>
      <a href="${resetLink}">Unlock My Account</a>
    
    </body>
  </html>
  `
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

}

module.exports=sendmail_accountlock;
