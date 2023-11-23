require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { generateAndStoreOTP } = require('../functions/otpFunctions');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    university: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email already exists"],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email");
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        minlength: 10, maxlength: 10,
    },
    verified: {
        type: Boolean,
        default: false
    },
    lock: {
        type: Boolean,
        default: false
    },
    image: {
        data: Buffer,
        contentType: String
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    university_img: {
        data: Buffer,
        contentType: String
    },
    address: {
        type: String,
        required: true
    }
});

// Encrypt password before saving
adminSchema.pre('save', async function (next) {
    const admin = this;
    if (admin.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(admin.password, salt);
    }
    next();
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;