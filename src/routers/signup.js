const express = require('express');
const path = require('path');
const Admin = require("../models/admin");
const router = express.Router();
const validator = require("validator");
const generateOTP = require("../functions/generateOTP");
const sendEmail = require("../functions/sendEmail");
const { userDelete } = require("../functions/userFunctions");
const { generateAndStoreOTP, verifyOTP } = require("../functions/otpFunctions");

router.get("/signup", async (req, res) => {
    const filePath = path.join(__dirname, "../../views", "signup");
    res.render(filePath);
});

async function registerUser(data, res) {
    const { adminName, email, Password, cPassword, mobile_no, university } = data;

    if (Password !== cPassword) {
        return res.send({ error: "Password and Confirm Password do not match" });
    }

    if (!validator.isEmail(email)) {
        return res.send({ error: "Not a valid Email" });
    }

    const userExists = await Admin.findOne({ email });

    if (userExists) {
        if (userExists.verified === 1) {
            return res.send({ error: "Email is already registered" });
        } else {
            return res.send({ error: "Your previous verification is still pending" });
        }
    }

    const OTP = generateAndStoreOTP(email);
    // console.log(OTP);

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
        await tempAdmin.save();

        // Send OTP to the user
        await sendEmail(email, OTP);

        // Delete user if time runs out
        setTimeout(userDelete, 30000, email);

        // Redirect to the OTP verification page
        res.render("verifyotp");

    } catch (error) {
        console.log(`tempAdmin.save() error: ${error})`);
        res.status(500).send({ error: "Server error" });
    }
}

// create a new faculty into the database
router.post("/signup/verifyotp", async (req, res) => {
    const data = req.body;
    await registerUser(data, res);
});

module.exports = router; // export router