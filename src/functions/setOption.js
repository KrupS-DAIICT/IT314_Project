const { log } = require("console");
const Admin = require("../models/admin");
const Faculty = require("../models/faculty");

const setOption = async (req, res, next) => {
    try {
        const universityOption = await Admin.find({}, 'university image').exec();
        res.locals.universityOption = universityOption;
        res.locals.universityData = universityOption;

        const courseOption = await Faculty.find({}, 'department').distinct('department');
        log(courseOption);
        res.locals.courseOption = courseOption;
        next();
    } catch (error) {
        console.log(error);
    }
}

module.exports = setOption;