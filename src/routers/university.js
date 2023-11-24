const express = require('express');
const router = express.Router();
const path = require('path');
const { setOption } = require('../functions/userFunctions');
const Admin = require('../models/admin');

router.get("/university", setOption, (req, res) => {
    const filePath = path.join(__dirname, "../../templates/views", "university");
    res.render(filePath);
});

router.get("/search-university", setOption, async (req, res) => {
    const searchdata = {};
    const university = req.query.university;
    const query = {}
    if (university) {
        query.university = { $regex: university, $options: 'i' };
        searchdata.university = university
    }
    const data = await Admin.find(query, 'university university_img');
    res.locals.universityData = data
    res.render("university", { searchdata: searchdata });
});

module.exports = router;