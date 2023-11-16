const checkSignupStep = (req, res, next) => {
    const signupStep = req.session.signupStep || 0;
    // console.log('signupStep:', req.session.signupStep, ' dest: 1');

    if (signupStep === 1 && (req.url === '/signup/verifyotp' || req.url === '/signup/otpverified')) {
        return res.redirect("/signup");
    }
    else if (signupStep === 2 && req.url === '/signup/otpverified') {
        return res.redirect("/signup/verifyotp");
    }
    else {
        next();
    }
}

module.exports = checkSignupStep; // export checkSignupStep