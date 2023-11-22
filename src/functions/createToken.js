require('dotenv').config()
const jwt = require('jsonwebtoken');

limit = 10 * 24 * 60 * 60;
const createToken = (result, role) => {
    if (role === 'admin')
        return jwt.sign({ _id: result._id, email: result.email, role: role, university: result.university }, process.env.SECRET_KEY, { expiresIn: limit })
    else
        return jwt.sign({ _id: result._id, email: result.email, role: role, university: result.institute }, process.env.SECRET_KEY, { expiresIn: limit })
}

module.exports = createToken;