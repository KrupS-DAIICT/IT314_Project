const express = require('express');
const path = require('path');
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const { verifyOTP } = require('../functions/otpFunctions');
const router = express.Router();

// async function generateAuthToken(admin) {
//     const token = jwt.sign({ _id: admin._id.toString() }, process.env.SECRET_KEY);
//     admin.tokens = admin.tokens.concat({ token: token });
//     await admin.save();
//     return token;
// }

router.get("/signup/verifyotp", async (req, res) => {
    const filePath = path.join(__dirname, "../../views", "verifyotp");
    res.render(filePath);
});

// create a new faculty into the database
router.post("/signup/otpverified", async (req, res) => {
    const data = req.body;
    const email = data.email;
    const user_OTP = data.otp;

    try {
        const tempUser = await Admin.findOne({ email: email });

        if (!tempUser) {
            console.log("User not found");
            return res.send(`<script>alert("User not found"); window.history.back();</script>`);
        }

        if (tempUser.verified == 1) {
            console.log("User already verified");
            res.send(`<script>alert("User already verified"); window.history.back();</script>`);
        }

        const isOTPValid = verifyOTP(email, user_OTP);

        if (!isOTPValid) {
            console.log("Invalid details or OTP expired");
            return res.send(`<script>alert("Invalid details or OTP expired"); window.history.back();</script>`);
        }

        console.log("UserWithOTP Found");
        await Admin.updateOne({ email: email }, { verified: 1 });

        const finalAdmin = await Admin.findOne({ email });
        if (finalAdmin) {
            const token = await finalAdmin.generateAuthToken();
            // console.log('Generated token:', token);
        } else {
            console.log('Admin not found');
        }

        res.render("otpverified");

    } catch (error) {
        console.log("Error verifying OTP: ", error);
        res.status(500).send("Error verifying OTP");
    }

});

module.exports = router; // export router