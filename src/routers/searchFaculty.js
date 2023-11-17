require('dotenv').config();
const express = require('express'); // require express
const router = express.Router(); // require router
const { log } = require('console');
const Faculty = require('../models/faculty');
const Math = require('math');
const setOption = require('../functions/setOption');

router.get("/search", setOption, async (req, res) => {
    res.render("search_faculty");
});

router.get('/search-faculty', setOption, async (req, res) => {
    const course = req.query.course;
    const search_query = req.query.search2;
    const university = req.query.university;
    // Pagination parameters
    // const perPage = 6; // Number of results per page
    // const page = parseInt(req.query.page) || 1; // Current page, default to 1

    // Build the query based on the filters with $regex
    const query = {};
    // if (location) {
    //   query.location = { $regex: location, $options: 'i' };
    // }
    // if (course) {
    //   query.course = { $regex: course, $options: 'i' };
    // }

    if (university) {
        query.university = { $regex: university, $options: 'i' };
    }
    if (course) {
        query.course = { $regex: course, $options: 'i' };
    }

    if (search_query) {
        query.name = { $regex: search_query, $options: 'i' };;
    }
    console.log(query);
    // Calculate the skip value for pagination
    //  const skip = (page - 1) * perPage;

    // Search the database with pagination and render the results in the search template
    const data = await Faculty.find(query)
    // .skip(skip)
    if (data) {
        // console.log(data.length);
        // res.json(data);
        // const totalPages = Math.ceil(data.length/ perPage);
        // console.log(totalPages);
        // ,page: page, totalPages: totalPages,currentUrl:currentUrl
        res.render('search_faculty', { data });
    }
})

module.exports = router; // export router