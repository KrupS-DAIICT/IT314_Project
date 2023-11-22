const express = require('express'); // require express
const { log } = require('console');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require("../models/admin"); // require admin.js
const { requireAuth } = require("../functions/userFunctions");
const Faculty = require("../models/faculty"); // require faculty.js
const path = require('path');
const router = express.Router(); // require router

const saltRounds = 10;

router.get("/change-password", requireAuth, (req, res) => {
    filePath = path.join(__dirname, '../../templates/views/', 'changepassword');
    res.render(filePath);
})

router.post("/change-password", async (req, res) => {
    const token = req.cookies.accesstoken;
    const { email, role } = jwt.verify(token, process.env.SECRET_KEY);
    try {
        const db = role === 'admin' ? Admin : Faculty;
        const result = await db.findOne({ $and: [{ email, verified: 1 }] }).exec();

        if (!result) {
            return res.send('<script>alert("Invalid User");window.history.back();</script>');
        }

        const auth = await bcrypt.compare(req.body.oldpassword, result.password);

        if (!auth) {
            return res.send('<script>alert("Invalid Old Password");window.history.back();</script>');
        }

        if (req.body.newpassword === req.body.cnewpassword) {
            await db.updateOne({ email }, { password: await bcrypt.hash(req.body.newpassword, saltRounds) });
            console.log('Password is updated');
            return res.send('<script>alert("Your Password is Updated");window.location.href="/";</script>');
        } else {
            return res.send('<script>alert("Passwords Do Not Match");window.history.back()</script>');
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }

});

module.exports = router; // export router