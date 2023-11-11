var nodemailer = require('nodemailer');
require('dotenv').config()
const profileupdatesendmail = async (mail,name) => {
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
  subject: 'Profile Update Notification',
  html: `
  <html>
  <head>
    <style>
      /* Define your CSS styles here */
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border: 1px solid #dddddd;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #333;
      }
      p {
        color: #666;
      }
      
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Profile Update Notification</h1>
      <p>Hello ${name},</p>
      <p>Your profile has been updated successfully.</p>
  
  
      <p>If you did not make these changes or have any concerns, please contact our support team immediately.</p>
      
      <p>Thank you for using our service!</p>
      

    </div>
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

module.exports=profileupdatesendmail ;
