const express = require('express'); // require express
const Admin = require("../models/admin"); // require admin.js
const Faculty = require("../models/faculty"); // require faculty.js
const router = express.Router(); // require router
const lockUser = require("../models/lockUser");
const SigninCount = require("../models/signinCount");
const verifyFaculty = require('../models/verifyFaculty');

router.get("/unlock-account", async (req, res) => {
    try {
        const { email, hash, role } = req.query;

        if (email && hash && role) {
            const emailSlice = email.slice(0, -1);

            const userModel = role.slice(0, -1) === 'admin' ? Admin : Faculty;
            const user = await lockUser.findOne({ email: emailSlice, link: hash });

            if (user) {
                await userModel.updateOne({ email: emailSlice }, { lock: false });
                await SigninCount.deleteOne({ email: emailSlice });
                await lockUser.deleteOne({ email: emailSlice });
                res.redirect("/signin");
            } else {
                return res.status(400).json({
                    message: "You have provided an invalid reset link"
                });
            }
        }
        else {
            return res.status(400).json({
                message: "You have provided an invalid reset link"
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.get("/verify-account", async (req, res) => {
    try {
        const { email, hash } = req.query;

        if (email && hash) {
            const emailSlice = email.slice(0, -1);

            const user = await verifyFaculty.findOne({ email: emailSlice, link: hash });

            if (user) {
                await Faculty.updateOne({ email: emailSlice }, { verified: true });
                await verifyFaculty.deleteOne({ email: emailSlice });
                res.send(`<script>alert("Account verified successfully"); window.location.href = "/signin";</script>`);
            } else {
                return res.status(400).json({
                    message: "You have provided an invalid verify link"
                });
            }
        }
        else {
            return res.status(400).json({
                message: "You have provided an invalid verify link"
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});



module.exports = router; // export router