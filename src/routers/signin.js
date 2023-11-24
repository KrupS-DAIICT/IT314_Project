require('dotenv').config();
const express = require('express'); // require express
const bcrypt = require('bcrypt'); // require bcrypt
const path = require('path'); // require path
const Admin = require("../models/admin"); // require admin.js
const Faculty = require("../models/faculty"); // require faculty.js
const router = express.Router(); // require router
// const cookieParser = require('cookie-parser'); // require cookie-parser
const { generateOTP } = require("../functions/otpFunctions");
const lockUser = require("../models/lockUser");
const { sendEmailLock } = require("../functions/mails");
const SigninCount = require("../models/signinCount");
const createToken = require("../functions/createToken");
const { log } = require('console');
const adminLockUpdate = require('../functions/adminLockUpdate');

const limit = 10 * 24 * 60 * 60;

router.get("/signin", async (req, res) => {
    const filePath = path.join(__dirname, "../../templates/views", "sign_in");
    res.render(filePath);
});

router.post("/signin", async (req, res) => {
    // if already signed in

    const { role, username, password } = req.body;

    try {
        const db = role === 'admin' ? Admin : Faculty;
        const result = await db.findOne({ $and: [{ email: username }, { verified: 1 }] }).exec();

        if (!result) {
            log("Result not found");
            return res.send(`<script>alert("Invalid Details"); window.history.back();</script>`);
        }

        if (result && result.lock) {
            handleAccountLock(username, role, result, req, res);
            return;
        }

        const auth = await bcrypt.compare(password, result.password);

        if (auth) {
            const result2 = await SigninCount.findOne({ $and: [{ ip: req.ip }, { email: username }] }).exec();
            // log(result2);
            if (result2) {
                await SigninCount.deleteOne({ _id: result2._id });
            }

            const token = createToken(result, role);
            res.cookie("accesstoken", token, { httpOnly: true, maxAge: limit }).status(200);

            res.redirect("/");
        } else {
            const result2 = await SigninCount.findOne({ $and: [{ ip: req.ip }, { email: username }] }).exec();

            if (!result2) {
                try {
                    const user = new SigninCount({
                        ip: req.ip,
                        email: username,
                        count: 1
                    });
                    const userSaved = await user.save();

                    handleInvalidDetails(userSaved, res);
                } catch (error) {
                    log(error);
                }
                return;
            }

            if (result2.count >= 5) {
                await SigninCount.updateOne({ _id: result2._id }, { count: result2.count + 1 });
                setTimeout(adminLockUpdate, 300000, username, db);
                handleAccountLock(username, role, db, req, res);
                return;
            } else {
                await SigninCount.updateOne({ _id: result2._id }, { count: result2.count + 1 });
                const updatedUser = await SigninCount.findOne({ $and: [{ ip: req.ip }, { email: username }] }).exec();
                handleInvalidDetails(updatedUser, res);
                return;
            }

        }
    } catch (error) {
        log(error);
    }

});

async function handleInvalidDetails(user, res) {
    log("Invalid details");
    res.send(`<script>alert("Invalid Details, remaining attempts before your account gets locked: ${5 - user.count}"); window.history.back();</script>`);
}

async function handleAccountLock(username, role, db, req, res) {
    log('Account locked');
    await db.updateOne({ lock: true });

    const otp = generateOTP(30);

    const result = await lockUser.findOne({ email: username }).exec();
    // log(result);

    try {
        if (result) {
            await lockUser.updateOne({ email: username }, { link: otp });
        } else {
            const lockedUser = new lockUser({ email: username, link: otp });
            await lockedUser.save();
        }
    } catch (error) {
        log(error);
    }

    const port = process.env.PORT || 8000;
    const resetLink = `http://localhost:${port}/unlock-account?email=${username}?&role=${role}?&hash=${otp}`;
    // log(resetLink);
    await sendEmailLock(username, resetLink);

    res.send(`<script>alert("Your account is locked, reset link is sent to your email."); window.history.back(); window.location.href="/signin";</script>`);
}

module.exports = router; // export router