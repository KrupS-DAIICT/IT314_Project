require('dotenv').config()
const jwt = require('jsonwebtoken');

limit = 10 * 24 * 60 * 60;
const createToken = (result, role) => {
    return jwt.sign({ _id: result._id, email: result.email, role: role }, process.env.SECRET_KEY, { expiresIn: limit })
}

module.exports = createToken;