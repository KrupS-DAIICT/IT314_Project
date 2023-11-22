require('dotenv').config();
const express = require('express'); // require express
const multer = require('multer');
const Admin = require("../models/admin"); // require admin.js
const router = express.Router(); // require router
const { log } = require('console');
const jwt = require("jsonwebtoken");
const { requireAuth } = require("../functions/userFunctions");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/admin-profile/:id", requireAuth, async (req, res) => {
    const profileId = req.params.id;
    const token = req.cookies.accesstoken;
    const data = jwt.verify(token, process.env.SECRET_KEY);
    log(data.university, token, profileId);
    log(profileId == data._id);
    log(data.role === 'admin');


    if (data && profileId == data._id && data.role === 'admin') {
        try {
            const profile = await Admin.findOne({ _id: profileId });
            if (profile && profile.email) {
                res.render('adminprofile.hbs', { profile });
            } else {
                res.status(400).json({
                    message: "Not found"
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    } else {
        return res.json({
            message: "You can not check other admin details"
        })
    }
});

router.post('/admin-profile-update/:id', upload.single('image'), async (req, res) => {
    const profileId = req.params.id;
    const token = req.cookies.accesstoken;
    const data = jwt.verify(token, process.env.SECRET_KEY);

    if (data.email !== req.body.email) {
        log("change email");
        res.cookie("accesstoken", '', { maxAge: 1 });
    }

    try {
        const result = await Admin.updateOne({ _id: profileId }, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.mobile_no,
            university: req.body.eniversity
        });
        // log(result);

        return res.send(`<script>alert("Data saved successfully"); window.location.href="/admin-profile/${profileId}";</script>`);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server error"
        });
    }
})

module.exports = router; // export router