const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (email, OTP) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            service: process.env.EMAIL_SERVICE,
            port: 587,
            secure: true,
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Sign Up OTP Verification',
            html: `
            <html lang="en">

            <head>
                <title>Sign Up OTP</title>
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
                    <div class="header">Welcome to FacultyHub</div>
                    <p>Thank you for signing up. To complete your registration, please enter the following OTP:</p>
                    <!-- OTP placeholder -->
                    <div class="otp">${OTP}</div>
                    <p>This OTP is valid for a single use and should be entered within a specific time frame.</p>
                    <p>If you did not sign up for an account on our website, please disregard this email.</p>
                    <p class="disclaimer">This is an automated email, please do not reply.</p>
                </div>
            </body>
            
            </html>
            `
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

const sendEmailLock = async (mail, resetLink) => {
    var transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        port: 587,
        secure: true,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASSWORD,
        },
    });


    var mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: `${mail}`,
        subject: 'Your Accout is Locked',
        html: `
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

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

};

const sendEmailLoginCredentials = async (mail, university, password, name, verificationLink) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        port: 587,
        secure: true,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: `${mail}`,
        subject: 'Your FacultyHub Login Credentials',
        html: `
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; text-align: center;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1>Welcome to FacultyHub!</h1>
                    <p>Hello, Mr./Mrs./Ms. ${name}</p>
                    <p>Thank you for joining FacultyHub, your one-stop solution to access data of all registered faculties in one place.</p>
                    <p>Here are your login credentials for your university ${university}:</p>
                    <p><strong>Username:</strong> ${mail}</p>
                    <p><strong>Password:</strong> ${password}</p>
                    <p>For your security, we recommend changing your password after the first login. You can do this from your profile page.</p>
                    <p>Before you proceed, please click the following link to verify your account and complete the sign-in process:</p>
                    <a href="${verificationLink}">Verify My Account</a>
                    <p>Explore the website and stay connected with the latest updates on your faculty members.</p>
                    <p>Thank you for being a part of FacultyHub!</p>
                </div>
                <div style="background-color: #f5f5f5; padding: 20px;">
                    <p style="font-size: 12px; color: #777;">This email was sent to you as a new user of FacultyHub. If you did not sign up for this service, please contact our support team immediately.</p>
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
};

const sendEmailPassReset = async (mail, resetLink) => {
    var transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        port: 587,
        secure: true,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASSWORD,
        },
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

};

const sendAccountRemovalEmail = async (email) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            service: process.env.EMAIL_SERVICE,
            port: 587,
            secure: true,
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Account Removal Notification',
            html: `
            <html lang="en">

            <head>
                <title>Account Removal Notification</title>
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
                        color: #ff0000; /* Red color for emphasis */
                    }
            
                    /* Body text */
                    .body-text {
                        font-size: 16px;
                        color: #333;
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
                    <div class="header">Account Removal Notification</div>
                    <p class="body-text">Dear Faculty Member,</p>
                    <p class="body-text">We regret to inform you that your account on FacultyHub has been removed by the admin of your university.</p>
                    <p class="body-text">If you believe this action is in error or if you have any concerns, please contact the university administration for further assistance.</p>
                    <p class="body-text">Thank you for your understanding.</p>
                    <p class="disclaimer">This is an automated email, please do not reply.</p>
                </div>
            </body>
            
            </html>
            `
        });

        console.log("Account removal email sent successfully");
    } catch (error) {
        console.log(error, "Account removal email not sent");
    }
};

module.exports = { sendEmail, sendEmailLock, sendEmailLoginCredentials, sendEmailPassReset, sendAccountRemovalEmail };