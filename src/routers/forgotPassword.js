const express = require('express'); // require express
const bcrypt = require("bcrypt");
const { log } = require('console');
const Admin = require("../models/admin"); // require admin.js
const Faculty = require("../models/faculty"); // require faculty.js
const router = express.Router(); // require router
const forgotPass = require("../models/forgotPass");
const { sendEmailPassReset } = require("../functions/mails");
const { generateOTP } = require('../functions/otpFunctions');
const path = require('path');

const saltRounds = 10;

router.get("/forgotlink", async (req, res) => {
    const filePath = path.join(__dirname, '../../templates/views', 'forgot_pass');
    res.render(filePath);
});

router.get("/reset-pass", async (req, res) => {
    try {
        const { email, hash, role } = req.query;

        if (!email || !hash || !role) {
            return res.status(400).json({
                message: "Invalid reset link 1"
            });
        }

        const emailSlice = email.slice(0, -1);
        const roleSlice = role.slice(0, -1);
        const user = await forgotPass.findOne({ $and: [{ email: emailSlice }, { link: hash }] });

        if (user) {
            const data = { email: emailSlice, role: roleSlice };
            return res.render("reset_pass.hbs", { data });
        } else {
            return res.status(400).json({
                message: "Invalid reset link 2"
            });
        }
    } catch (error) {
        log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.post("/forgot-password", async (req, res) => {
    try {
        const email = req.body.email;
        const user1 = await forgotPass.findOne({ email: email });

        if (user1) {
            return res.send(`<script>alert("Link is already shared in your email"); window.history.back();</script>`);
        }

        const user_admin = await Admin.findOne({ email });
        const user_faculty = await Faculty.findOne({ email });
        const db = user_admin ? Admin : user_faculty ? Faculty : null;
        const role = user_admin ? 'admin' : user_faculty ? 'faculty' : null;

        if (!db) {
            return res.status(400).json({
                message: "Invalid email address"
            });
        }

        const otp = generateOTP(15);
        log(otp);

        try {
            const user = new forgotPass({ email, link: otp });
            const result = await user.save();
        } catch (error) { log(error); }

        const port = process.env.PORT || 8000;
        const resetLink = `http://localhost:${port}/reset-pass?email=${email}?&role=${role}?&hash=${otp}`;
        log(resetLink);

        // await sendEmailPassReset(email, resetLink);

        // return res.send('<script>alert("Link is shared in your email"); window.location.href = "/redirect-page";</script>');
        return res.send(`<script>alert("link is shared in your email"); window.history.back();</script>`);

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.post("/reset-pass/:id", async (req, res) => {
    const email = req.params.id;
    const user = await forgotPass.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "Invalid reset link 3"
        });
    }

    const password = req.body.pass;
    const cpassword = req.body.conpass;

    if (password !== cpassword) {
        return res.send(`<script>alert("Passwords Do Not Match"); window.history.back();</script>`);
    }

    try {
        const user_admin = await Admin.findOne({ email });
        const user_faculty = await Faculty.findOne({ email });
        const db = user_admin ? Admin : user_faculty ? Faculty : null;

        if (!db) {
            return res.status(400).json({
                message: "Invalid email address"
            });
        }

        const temp = await db.findOneAndUpdate({ email }, { password: await bcrypt.hash(password, saltRounds) });
        await forgotPass.deleteOne({ email });

        return res.send(`<script>alert("Password updated"); window.location.href = "/signin" </script>`);
    } catch (error) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router; // export router