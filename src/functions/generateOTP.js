const otpGenerator = require('otp-generator');

function generateOTP() {
    const OTP = otpGenerator.generate(6, {
        specialChars: false,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false
    });
    return OTP;
}

// console.log(generateOTP());
module.exports = generateOTP;