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
  text: `Your OTP is ${otp}`
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
