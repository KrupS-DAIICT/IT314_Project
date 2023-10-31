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
                    <div class="header">Welcome to Your Website</div>
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

module.exports = sendEmail;