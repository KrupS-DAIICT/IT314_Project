const { log } = require("console");
const Admin = require("../models/admin");
const Faculty = require("../models/faculty");

const setOption = async (req, res, next) => {
    try {
        const universityOption = await Admin.find({}, 'university').distinct('university');
        // log(universityOption);
        res.locals.universityOption = universityOption;
        res.locals.universityData = universityOption;

        const courseOption = await Faculty.find({}, 'department').distinct('department');
        const filteredCourseOptions = courseOption.filter(option => option != null && option.trim() != '');
        // log(filteredCourseOptions);
        res.locals.courseOption = filteredCourseOptions;
        next();
    } catch (error) {
        console.log(error);
    }
}

module.exports = setOption;