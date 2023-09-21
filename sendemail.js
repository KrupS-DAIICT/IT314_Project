var nodemailer = require('nodemailer');
const sendmail = async (mail,otp) => {
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'Sender Mail',
    pass: 'APP Password'
  }
});


var mailOptions = {
  from: 'Sender Mail',
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
