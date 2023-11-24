require('dotenv').config();
const express = require('express'); // require express
const router = express.Router(); // require router
const Admin = require("../models/admin"); // require admin.js
const Faculty = require("../models/faculty"); // require faculty.js
const jwt = require('jsonwebtoken');
const { log } = require('console');
const { sendAccountRemovalEmail } = require("../functions/mails");

router.delete("/admin-profile-remove/:id", async (req, res) => {
    try {
        const profileId = req.params.id;
        const token = req.cookies.accesstoken;

        const data = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(profileId);
        if (profileId === data._id && data.role === "admin") {

            try {
                const admin = await Admin.findById(profileId);
                const university = admin.university;
                await Admin.deleteOne({ _id: profileId });
                log("Admin removed successfully.");

                // deleting all faculties assosiated with admin
                await Faculty.deleteMany({ institute: university });
                log("Faculties removed successfully");

            } catch (error) {
                console.log(error);
                return res.status(400).json({
                    message: "Internal server error"
                });
            }


            res.sendStatus(200);
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        })
    }

});


router.delete("/faculty-profile-remove/:id", async (req, res) => {
    try {
        const profileId = req.params.id;
        const token = req.cookies.accesstoken;
        const data = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(data);
        if (profileId === data._id && data.role === "faculty") {
            // deleting faculty data
            await Faculty.deleteOne({ _id: profileId });
            res.sendStatus(200);
        }

        res.sendStatus(400);

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        })
    }

});

router.delete("/faculty-remove/:id", async (req, res) => {
    try {
        const profileId = req.params.id;
        const token = req.cookies.accesstoken;
        const data = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(data);

        const faculty = await Faculty.findById(profileId);

        // deleting faculty data
        await Faculty.deleteOne({ _id: profileId });

        // send mail
        sendAccountRemovalEmail(faculty.email);

        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        })
    }

});

module.exports = router;