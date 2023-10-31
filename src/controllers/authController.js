const validator = require('validator');
const bcrypt = require('bcryptjs');
const generateOTP = require('../functions/generateOTP');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const { userDelete, adminLockUpdate } = require('../controllers/middleFuncs');

require("../db/conn");
require("dotenv").config();

const limit = 10 * 24 * 60 * 60;

const crateToken = (email) => {
    return jwt.sign({ email }, process.env.SECRET_KEY, {
        expiresIn: limit
    });
}


