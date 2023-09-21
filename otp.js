const otpGenerator=require("otp-generator");

const generateOTP = ()=> {
    const OTP = otpGenerator.generate(6,{
        specialChars:false
    });
    return OTP;
};

module.exports = generateOTP();