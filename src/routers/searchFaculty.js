require('dotenv').config();
const express = require('express'); // require express
const router = express.Router(); // require router
const { log } = require('console');
const Faculty = require('../models/faculty');
const Math = require('math');
const { setOption } = require('../functions/userFunctions');
const path = require('path');

router.get("/search", setOption, async (req, res) => {
    const filePath = path.join(__dirname, '../../templates/views/', 'search_faculty');
    res.render(filePath);
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
    const searchdata = {};
    // if (location) {
    //   query.location = { $regex: location, $options: 'i' };
    // }
    // if (course) {
    //     query.course = { $regex: course, $options: 'i' };
    // }

    try {
        if (university) {
            query.institute = { $regex: university, $options: 'i' };
            searchdata.university = university;
        }
        if (course) {
            query.department = { $regex: course, $options: 'i' };
            searchdata.department = course;
        }

        if (search_query) {
            query.name = { $regex: search_query, $options: 'i' };
            searchdata.search_query = search_query;
        }
    } catch (error) {

    }
    // console.log(query);
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
        res.render('search_faculty', { data, searchdata });
    }
})

module.exports = router; // export router