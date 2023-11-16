const express = require('express'); // require express
const Admin = require("../models/admin"); // require admin.js
const Faculty = require("../models/faculty"); // require faculty.js
const router = express.Router(); // require router
const { log } = require('console');

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
            await db.updateOne({ email }, { password: req.body.newpassword });
            console.log('Password is updated');
            return res.send('<script>alert("Your Password is Updated");window.location.href="/home";</script>');
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