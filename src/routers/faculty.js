require('dotenv').config();
const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { handleExcel, generateRandomPassword } = require("../functions/handleExcel");
const { requireAuth } = require("../functions/userFunctions");
const Faculty = require("../models/faculty");
const { log } = require("console");
const router = express.Router();
const { sendEmailLoginCredentials } = require("../functions/mails");
const validator = require("validator");
const { generateOTP } = require('../functions/otpFunctions');
const verifyFaculty = require('../models/verifyFaculty');
const { deleteAccount } = require('../functions/adminLockUpdate');


router.get("/addfaculty", requireAuth, async (req, res) => {
    const filePath = path.join(__dirname, "../../templates/views/", "addFaculty");
    res.render(filePath);
});

router.get("/faculty/:id", async (req, res) => {
    try {
        const profileId = req.params.id;
        const faculty = await Faculty.findOne({ _id: profileId });

        if (!faculty) {
            return res.status(404).json({
                message: "Not found"
            });
        }

        res.status(200).render('faculty_search_profile', { faculty });
    } catch (error) {
        log(error);
    }
    // log(profile);
    // res.render('page', { profile });
});

router.get("/faculty-profile/:id", requireAuth, async (req, res) => {
    const profileId = req.params.id;
    const token = req.cookies.accesstoken;
    const data = jwt.verify(token, process.env.SECRET_KEY);

    // log(req.params.id);
    // log(data, token, profileId);
    // log(profileId == data._id);
    // log(data.role === 'faculty');

    if (data && profileId == data._id && data.role === 'faculty') {
        try {
            const profile = await Faculty.findOne({ _id: profileId });
            if (profile && profile.email) {
                res.render('faculty_profile.hbs', { profile });
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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage }); // multer configuration

// create a new faculty into the database
router.post("/addfaculty", upload.single("excelFile"), async (req, res) => {
    if (req.file && req.file.filename) {
        const excelAdded = await handleExcel(req, res);
        return;
    }

    const { facultyName, email, contactNo, education, fieldOfSpecialization, coursesTaught, website, publications } = req.body;

    if (!validator.isEmail(email)) {
        return res.send(`<script>alert("Not a valid email"); window.history.back();</script>`);
    }

    const token = req.cookies.accesstoken;
    const data = jwt.verify(token, process.env.SECRET_KEY);
    log(data);

    try {
        const faculty = await Faculty.findOne({ email });
        if (faculty) {
            return res.send(`<script>alert("Faculty already added with given email"); window.location.href="/addfaculty"</script>`)
        }
    } catch (error) {
        log(error);
        res.send(`<script>alert("Error adding faculty"); window.location.href="/addfaculty"</script>`)
    }

    try {
        const pass = generateRandomPassword();
        const faculty = await Faculty.create({
            name: facultyName,
            institute: data.university,
            email,
            contactNo,
            education,
            fieldOfSpecialization,
            coursesTaught,
            website,
            publications,
            password: pass,
        });
        log(pass);

        // send email before registring
        const otp = generateOTP(30);
        const port = process.env.PORT || 8000;
        const verifyLink = `http://localhost:${port}/verify-account?email=${email}?&hash=${otp}`

        const verifyData = new verifyFaculty({
            email,
            link: otp
        });
        await verifyData.save();

        await sendEmailLoginCredentials(email, data.university, pass, facultyName, verifyLink);
        setTimeout(deleteAccount, 1000 * 60 * 60 * 24 * 7, email);

        res.status(200).send(`<script>alert("Faculty Added successfully"); window.location.href="/addfaculty"</script>`)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }

});

router.post('/faculty-profile-update/:id', async (req, res) => {
    const profileId = req.params.id;
    const token = req.cookies.accesstoken;
    const data = jwt.verify(token, process.env.SECRET_KEY);

    if (data.email !== req.body.email) {
        log("change email");
        res.cookie("accesstoken", '', { maxAge: 1 });
    }

    try {
        const result = await Faculty.updateOne({ _id: profileId }, {
            name: req.body.name,
            contactNo: req.body.contactNo,
            institute: req.body.institute,
            address: req.body.address,
            email: req.body.email,
            education: req.body.education,
            coursesTaught: req.body.coursesTaught,
            specialization: req.body.fieldOfSpecialization,
            website: req.body.website,
            publications: req.body.publications,
            department: req.body.department,
        });
        // log(result);

        return res.send(`<script>alert("Data saved successfully"); window.location.href="/faculty-profile/${profileId}";</script>`);
    } catch (error) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.post('/faculty-profile/:id/add-internship', async (req, res) => {
    const profileId = req.params.id;
    const token = req.cookies.accesstoken;
    const data = jwt.verify(token, process.env.SECRET_KEY);

    try {
        const result = await Faculty.updateOne({ _id: profileId }, {
            $push: {
                internships: {
                    title: req.body.title,
                    description: req.body.desc,
                    duration: req.body.duration,
                    type: req.body.type,
                }
            }
        });
        // log(result);

        return res.send(`<script>alert("Data saved successfully"); window.location.href="/faculty-profile/${profileId}";</script>`);
    } catch (error) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router; // export router