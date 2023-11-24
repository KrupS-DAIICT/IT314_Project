const otpGenerator = require('otp-generator');
const otpCache = {};
const expTime = 5 * 60 * 1000; // 5 minutes

// function to generate OTP
function generateOTP(num) {
    const OTP = otpGenerator.generate(num, {
        specialChars: false,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false
    });
    return OTP;
}

// Function to generate and store OTP
function generateAndStoreOTP(email, num) {
    const OTP = generateOTP(num);
    otpCache[email] = { otp: OTP, expires: Date.now() + expTime };
    return OTP;
}

// Function to verify OTP
function verifyOTP(email, user_OTP) {
    const storedOTP = otpCache[email];
    if (storedOTP && storedOTP.otp === user_OTP && Date.now() < storedOTP.expires) {
        delete otpCache[email];
        return true;
    }
    return false;
}

module.exports = { generateOTP, generateAndStoreOTP, verifyOTP };
