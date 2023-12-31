require('dotenv').config();
const mongoose = require('mongoose'); // require mongoose
const validator = require('validator'); // require validator
const bcrypt = require('bcrypt'); // require bcrypt

const facultySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contactNo: {
        type: String,
        default: ""
    },
    institute: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default: ""
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
    education: {
        type: String,
        required: false
    },
    coursesTaught: {
        type: String,
        required: false
    },
    specialization: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    publications: {
        type: String,
        required: false,
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
        contentType: String,
    },
    department: {
        type: String,
        default: ""
    },
    internship: [
        {
            name: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            field: {
                type: String,
                required: false
            },
            duration: {
                type: String,
                required: false
            },
            position: {
                type: String,
                required: false
            }
        }
    ]
});

// Encrypt password before saving
facultySchema.pre('save', async function (next) {
    const admin = this;
    if (admin.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(admin.password, salt);
    }
    next();
});

// Create a new collection(Table)
const Faculty = new mongoose.model("Faculty", facultySchema);
module.exports = Faculty; // export Faculty