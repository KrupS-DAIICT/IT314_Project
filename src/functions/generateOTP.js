const otpGenerator = require('otp-generator');

function generateOTP(num) {
    const OTP = otpGenerator.generate(num, {
        specialChars: false,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false
    });
    return OTP;
}

// console.log(generateOTP());
module.exports = generateOTP;