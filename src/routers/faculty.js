const express = require('express'); // require express
const path = require('path'); // require path
const Faculty = require("../models/faculty"); // require faculty.js
const router = express.Router(); // require router

const filePath = path.join(__dirname, "../../views", "addFaculty");

router.get("/addfaculty", async (req, res) => {
    res.render(filePath);
});

// create a new faculty into the database
router.post("/addfaculty", async (req, res) => {
    try {
        const addFaculty = new Faculty({
            name: req.body.facultyName,
            institute: req.body.institute,
            email: req.body.email,
            contactNo: req.body.contactNo,
            education: req.body.education,
            instituteOfEducation: req.body.instituteOfEducation,
            fieldOfSpecialization: req.body.fieldOfSpecialization,
            courcesTaught: req.body.coursesTaught,
            website: req.body.website,
            publications: req.body.publications,
            biography: req.body.biography
        });

        const facultyAdded = await addFaculty.save();
        res.status(201).render(filePath);
        // res.send(`<script>alert("Faculty added successfully."); window.history.back()</script>`);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router; // export router