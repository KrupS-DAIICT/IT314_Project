const express = require('express');
const path = require('path');
const Admin = require("../models/admin");
const router = express.Router();
const validator = require("validator");
const multer = require('multer');
const { userDelete } = require("../functions/userFunctions");
const { generateAndStoreOTP } = require("../functions/otpFunctions");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/signup", async (req, res) => {
    // req.session.signupStep = 1;
    const filePath = path.join(__dirname, "../../views", "signup");
    res.render(filePath);
});

async function registerUser(data, req, res) {
    const { adminName, email, Password, cPassword, mobile_no, university, image } = data;

    if (Password !== cPassword) {
        return res.send(`<script>alert("Password and Confirm Password do not match"); window.history.back();</script>`);
    }

    if (!validator.isEmail(email)) {
        return res.send(`<script>alert("Not a valid email"); window.history.back();</script>`);
    }

    const userExists = await Admin.findOne({ email });
    // console.log(userExists);

    if (userExists && userExists.verified === true) {
        return res.send(`<script>alert("Email is already registered"); window.history.back(); </script>`);
    }
    else if (userExists && userExists.verified === false) {
        return res.send(`<script>alert("Verification is incomplete for this user. Redirecting to verification page."); window.location.href="/signup/verifyotp"; </script>`)
    }

    const OTP = generateAndStoreOTP(email, 6);
    console.log(OTP);

    try {
        const tempAdmin = new Admin({
            name: adminName,
            email: email,
            password: Password,
            OTP: OTP,
            phone: mobile_no,
            university: university,
            image: {
                data: req.file.buffer.toString('base64'),
                contentType: req.file.mimetype
            }
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
router.post("/signup/verifyotp", upload.single('image'), async (req, res) => {
    const data = req.body;
    await registerUser(data, req, res);
});

module.exports = router; // export router