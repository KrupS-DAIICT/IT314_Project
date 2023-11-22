const express = require('express');
const path = require('path');
const Admin = require("../models/admin");
const router = express.Router();

router.get("/signup/otpverified", async (req, res) => {
    const filePath = path.join(__dirname, "../../templates/views", "otpverified");
    res.render(filePath);
});

module.exports = router; // export router