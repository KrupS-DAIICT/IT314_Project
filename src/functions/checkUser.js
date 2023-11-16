require('dotenv').config();
const jwt = require('jsonwebtoken');
const Admin = require("../models/admin");
const Faculty = require("../models/faculty");


const checkUser = async (req, res, next) => {
    const token = req.cookies.accesstoken;

    try {
        if (token) {
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            res.locals.user = decodedToken.role === 'admin'
                ? await Admin.findOne({ email: decodedToken.email }).exec()
                : await Faculty.findOne({ email: decodedToken.email }).exec();
        } else {
            res.locals.user = null;
        }
    } catch (error) {
        console.log(error);
        res.locals.user = null;
    } finally {
        next();
    }
}

module.exports = checkUser;