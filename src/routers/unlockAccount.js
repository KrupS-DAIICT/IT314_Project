const express = require('express'); // require express
const Admin = require("../models/admin"); // require admin.js
const Faculty = require("../models/faculty"); // require faculty.js
const router = express.Router(); // require router
const lockUser = require("../models/lockUser");
const SigninCount = require("../models/signinCount");
const { log } = require('console');

router.get("/unlock-account", async (req, res) => {
    try {
        log(req.query);
        const { email, hash, role } = req.query;
        log(email, hash, role);

        if (email && hash && role) {
            const emailSlice = email.slice(0, -1);
            log(emailSlice);

            const userModel = role.slice(0, -1) === 'admin' ? Admin : Faculty;
            const user = await lockUser.findOne({ email: emailSlice, link: hash });
            log(user);

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

module.exports = router; // export router