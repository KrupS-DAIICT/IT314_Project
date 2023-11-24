require("dotenv").config();
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const Faculty = require("../models/faculty");

const requireAuth = (req, res, next) => {
    const token = req.cookies.accesstoken;

    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
            if (err) {
                res.redirect('/signin');
            } else {
                next();
            }
        })
    } else {
        res.redirect('/signin');
    }
};

const adminAuth = (req, res, next) => {
    const token = req.cookies.accesstoken;

    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
            if (err) {
                res.redirect('/signin');
            } else if (decodedToken.role === 'admin') {
                next();
            }
        })
    } else {
        res.redirect('/signin');
    }
};

const checkUser = (req, res, next) => {
    const token = req.cookies.accesstoken;

    if (!token) {
        res.locals.user = null;
        return next();
    }


    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
        if (err) {
            res.locals.user = null;
            return next();
        }

        try {
            const query = { email: decodedToken.email };
            const fields = decodedToken.role === 'admin' ? '_id email university' : '_id email institute';
            const user = await (decodedToken.role === 'admin' ? Admin : Faculty).findOne(query, fields).exec();

            if (!user) {
                res.cookie("accesstoken", '', { maxAge: 1 });
                return res.redirect('/');
            }

            user.role = decodedToken.role;
            res.locals.user = user;
            next();
        }
        catch (err) {
            console(err);
            next(err);
        }
    })
};

const userDelete = async (email) => {
    const user = await Admin.findOne({ email: email });
    if (user.verified == 0) {
        const deleteData = await Admin.deleteOne({ email: email });
        console.log("User deleted successfully");
    }
};

const setOption = async (req, res, next) => {
    try {
        const universityOption = await Admin.find({}, 'university university_img').exec();
        // console.log(universityOption);
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
};

module.exports = { requireAuth, adminAuth, checkUser, userDelete, setOption };