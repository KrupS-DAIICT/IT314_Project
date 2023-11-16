const express = require('express');
const path = require('path');
// const checkSignupStep = require('../middleware/checkSignupStep');
const Admin = require("../models/admin");
const router = express.Router();

router.get("/signup/otpverified", async (req, res) => {
    // console.log(`signupStep: ${req.session.signupStep} dest: 3`);
    const filePath = path.join(__dirname, "../../views", "otpverified");
    res.render(filePath);
});

module.exports = router; // export router