const express = require('express');
const path = require('path');
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const { verifyOTP } = require('../functions/otpFunctions');
const router = express.Router();
const createToken = require("../functions/createToken");

router.get("/signup/verifyotp", async (req, res) => {
    const filePath = path.join(__dirname, "../../templates/views", "verifyotp");
    res.render(filePath);
});

// create a new faculty into the database
async function verifyOTPFunction(data, req, res) {
    const { email, otp } = data;

    try {
        const tempUser = await Admin.findOne({ email: email });

        if (!tempUser) {
            console.log("User not found");
            return res.send(`<script>alert("User not found"); window.history.back();</script>`);
        }

        if (tempUser.verified == 1) {
            console.log("User already verified");
            res.send(`<script>alert("User already verified"); window.location.href = "/signin";</script>`);
        }

        // console.log("reached");
        const isOTPValid = verifyOTP(email, otp);
        // console.log(`isOTPValid: ${isOTPValid}`);

        if (!isOTPValid) {
            console.log("Invalid details or OTP expired");
            return res.send(`<script>alert("Invalid details or OTP expired"); window.history.back();</script>`);
        }

        console.log("UserWithOTP Found");
        const adminUpdated = await Admin.updateOne({ email: email }, { verified: 1 });

        const finalAdmin = await Admin.findOne({ email });
        if (finalAdmin) {
            const token = createToken(finalAdmin, 'admin');
            // console.log('Generated token:', token);
        } else {
            console.log('Admin not found');
        }

        res.send(`<script>alert("OTP verification successful. redirecting to sign in page.."); window.location.href="/signin"</script>`);

    } catch (error) {
        console.log("Error verifying OTP: ", error);
        res.status(500).send("Error verifying OTP");
    }
}

router.post("/signup/otpverified", async (req, res) => {
    const data = req.body;
    await verifyOTPFunction(data, req, res);
});

module.exports = router; // export router