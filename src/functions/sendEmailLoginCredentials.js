const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmailLoginCredentials = async (mail, password, university, name) => {
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

module.exports = sendEmailLoginCredentials;
