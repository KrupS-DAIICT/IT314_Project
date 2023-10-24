const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

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
        unique: true,
        minlength: 10, maxlength: 10,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

// Generate Auth Token
adminSchema.methods.generateAuthToken = async function (req, res) {
    try {
        const admin = this;
        const token = jwt.sign({ _id: admin._id.toString()}, process.env.SECRET_KEY);
        admin.tokens = admin.tokens.concat({ token: token });
        await this.save();
        
        return token;
    } catch (e) {
        res.status(400).send(e);
    }
}

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