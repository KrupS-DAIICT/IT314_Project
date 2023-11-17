const express = require('express');
const path = require('path');
const Admin = require("../models/admin");
const router = express.Router();
const validator = require("validator");
const multer = require('multer');
const { userDelete } = require("../functions/userFunctions");
const { generateAndStoreOTP } = require("../functions/otpFunctions");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/signup/add-university", async (req, res) => {
    // req.session.signupStep = 1;
    const filePath = path.join(__dirname, "../../templates/views", "add_university");
    res.render(filePath);
});

module.exports = router; // export router