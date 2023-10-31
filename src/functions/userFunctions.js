const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const checkUser = (req, res, next) => {
    const token = req.cookies.accesstoken;
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                console.log(decodedToken);
                let user = await Admin.findById(decodedToken._id);
                res.locals.user = user;
                next();
            }
        });
    }
    else {
        res.locals.user = null;
        next();
    }
}

const userDelete = async (email) => {
    const user = await Admin.findOne({ email: email });
    if (user.verified == 0) {
        const deleteData = await Admin.deleteOne({ email: email });
        console.log("User deleted successfully");
    }
}

module.exports = { checkUser, userDelete };