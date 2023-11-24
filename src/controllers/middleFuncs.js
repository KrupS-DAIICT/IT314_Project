const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const requireAuth = (req, res, next) => {
    const token = req.cookies.accesstoken;
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect("/signin");
            } else {
                // console.log(decodedToken);
                next();
            }
        });
    }
    else {
        res.redirect("/signin");
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.accesstoken;
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                // console.log(decodedToken);
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

const adminLockUpdate = async (email) => {
    await Admin.updateOne({ email: email }, { lock: false });
}

module.exports = { requireAuth, checkUser, userDelete, adminLockUpdate };