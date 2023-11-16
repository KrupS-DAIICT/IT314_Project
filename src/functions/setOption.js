const Admin = require("../models/admin");

const setOption = async (req, res, next) => {
    try {
        const universityOption = await Admin.find({}, 'university image').exec();
        res.locals.universityOption = universityOption;
        res.locals.universityData = universityOption;
        next();
    } catch (error) {
        console.log(error);
    }
}

module.exports = setOption;