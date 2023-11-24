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

router.post('/admin-profile-update/:id', upload.fields([{ name: 'admin_img', maxCount: 1 }, { name: 'university_img', maxCount: 1 }]), async (req, res) => {
    const profileId = req.params.id;
    const token = req.cookies.accesstoken;
    const data = jwt.verify(token, process.env.SECRET_KEY);
    // log(data);

    if (data.email !== req.body.email) {
        log("change email");
        res.cookie("accesstoken", '', { maxAge: 1 });
    }

    try {
        const updateFields = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.mobile_no,
            university: req.body.university,
            address: req.body.university_address,
        };

        // Check if 'admin_img' is present in the request
        if (req.files && req.files['admin_img']) {
            updateFields.image = {
                data: req.files['admin_img'][0].buffer.toString('base64'),
                contentType: req.files['admin_img'][0].mimetype
            };
        }

        // Check if 'university_img' is present in the request
        if (req.files && req.files['university_img']) {
            updateFields.university_img = {
                data: req.files['university_img'][0].buffer.toString('base64'),
                contentType: req.files['university_img'][0].mimetype
            };
        }

        const result = await Admin.updateOne({ _id: profileId }, updateFields);

        return res.send(`<script>alert("Data saved successfully"); window.location.href="/admin-profile/${profileId}";</script>`);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server error"
        });
    }
})

module.exports = router; // export router