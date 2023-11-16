const express = require('express');
const path = require('path');
const router = express.Router();
const validator = require("validator");

router.get("/", async (req, res) => {
    // req.session.signupStep = 1;
    const filePath = path.join(__dirname, "../../views", "index");
    res.render(filePath);
});

router.post('/logout', (req, res) => {
    res.cookie("accesstoken", '', { maxAge: 1 })
    res.redirect("/signin");
})

module.exports = router;