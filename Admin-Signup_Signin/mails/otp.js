const otpGenerator=require("otp-generator");

const generateOTP = (num)=> {
    const OTP = otpGenerator.generate(num,{
        specialChars:false,
        upperCaseAlphabets:false,
        lowerCaseAlphabets :false
    });
    return OTP;
};



module.exports = generateOTP;