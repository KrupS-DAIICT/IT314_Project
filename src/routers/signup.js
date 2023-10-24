const express = require('express'); // require express
const path = require('path'); // require path
const Admin = require("../models/admin"); // require faculty.js
const router = express.Router(); // require router
// const cookieParser = require('cookie-parser'); // require cookie-parser

app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

router.get("/signup", async (req, res) => {
    const filePath = path.join(__dirname, "../../views", "signup");
    res.render(filePath);
});

// create a new faculty into the database
router.post("/signup", async (req, res) => {
    try {
        const name = req.body.adminName;
        const email = req.body.email;
        const password = req.body.Password;
        const cPassword = req.body.cPassword;
        const phone = req.body.mobile_no;
        const university = req.body.university;

        if (password == cPassword) {
            const addAdmin = new Admin({
                name: name,
                email: email,
                password: password,
                phone: phone,
                university: university
            });

            const token = await addAdmin.generateAuthToken();
            
            res.cookie("signup", token, {
                expires: new Date(Date.now() + 30000),
                httpOnly: true
            });

            const adminAdded = await addAdmin.save();
            const redirectPath = path.join(__dirname, "../../views", "signin");
            res.status(201).render(redirectPath);
        }else {
            res.send(`<script>alert("Password and confirm password are not matching."); window.history.back()</script>`);
        }

    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router; // export router