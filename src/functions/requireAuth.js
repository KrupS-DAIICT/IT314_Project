require('dotenv').config();
const jwt = require('jsonwebtoken');

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
}

module.exports = requireAuth;