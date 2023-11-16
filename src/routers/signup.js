const express = require('express');
const path = require('path');
const Admin = require("../models/admin");
const router = express.Router();
const validator = require("validator");
const generateOTP = require("../functions/generateOTP");
const sendEmail = require("../functions/sendEmail");
const { userDelete } = require("../functions/userFunctions");
const { generateAndStoreOTP } = require("../functions/otpFunctions");

router.get("/signup", async (req, res) => {
    // req.session.signupStep = 1;
    const filePath = path.join(__dirname, "../../views", "signup");
    res.render(filePath);
});

async function registerUser(data, req, res) {
    const { adminName, email, Password, cPassword, mobile_no, university } = data;

    if (Password !== cPassword) {
        return res.send({ error: "Password and Confirm Password do not match" });
    }

    if (!validator.isEmail(email)) {
        return res.send({ error: "Not a valid Email" });
    }

    const userExists = await Admin.findOne({ email });
    // console.log(userExists);

    if (userExists !== null && userExists.verified === true) {
        return res.send(`<script>alert("Email is already registered"); window.history.back(); </script>`);
    }
    else if (userExists && userExists.verified === false) {
        return res.send(`<script>alert("Verification is incomplete for this user. Redirecting to verification page."); window.history.back(); </script>`)
    }

    const OTP = generateAndStoreOTP(email, 6);
    console.log(OTP);

    try {
        const tempAdmin = new Admin({
            name: adminName,
            email,
            password: Password,
            OTP,
            phone: mobile_no,
            university,
        });

        // Save the user
        if (!userExists) {
            await tempAdmin.save();
        }

        // Send OTP to the user
        // const emailSent = await sendEmail(email, OTP);

        // Delete user if time runs out
        setTimeout(userDelete, 5 * 60 * 1000, email);

        // Redirect to the OTP verification page
        // req.session.signupStep = 2;
        res.redirect('/signup/verifyotp');

    } catch (error) {
        console.log(`tempAdmin.save() error: ${error})`);
        res.status(500).send({ error: "Server error" });
    }
}

// create a new faculty into the database
router.post("/signup/verifyotp", async (req, res) => {
    const data = req.body;
    await registerUser(data, req, res);
});

module.exports = router; // export router