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
  subject: 'Your Accout is lock',
  html : `<p>Click on the link to unlock your account</p>
              <br>
              <h1>link will expire in 5 min</h1>
              <br>
              <a href="${resetLink}">link</a>`
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
