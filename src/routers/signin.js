const express = require('express'); // require express
const bcrypt = require('bcrypt'); // require bcrypt
const path = require('path'); // require path
const Admin = require("../models/admin"); // require admin.js
const Faculty = require("../models/faculty"); // require faculty.js
const router = express.Router(); // require router
// const cookieParser = require('cookie-parser'); // require cookie-parser

app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

router.get("/signin", async (req, res) => {
    const filePath = path.join(__dirname, "../../views", "signin");
    res.render(filePath);
});

router.post("/signin", async (req, res) => {
    try {
        const person = req.body.role;
        const email = req.body.email;
        const password = req.body.Password;

        const user = person == "admin" ? Admin : Faculty;
        const userEmail = await user.findOne({ email: email });
        const isMatch = await bcrypt.compare(password, userEmail.password);

        // generate auth token
        const token = await userEmail.generateAuthToken();
        res.cookie("signin", token, {
            expires: new Date(Date.now() + 60*1000),
            httpOnly: true
        });

        if(isMatch) {
            const redirectPath = path.join(__dirname, "../../views", "addFaculty");
            res.status(201).render(redirectPath);
        }
        else    
            res.send(`<script>alert("Invalid credentials."); window.history.back()</script>`);


    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router; // export router