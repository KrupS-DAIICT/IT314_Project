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
        default: "Not Available"
    },
    password: {
        type: String,
        required: true
    },
    education: {
        type: String,
        default: ""
    },
    coursesTaught: {
        type: String,
        default: ""
    },
    specialization: {
        type: String,
        default: ""
    },
    website: {
        type: String,
        default: ""
    },
    publications: {
        type: [String],
        default: []
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
                default: ""
            },
            description: {
                type: String,
                default: ""
            },
            field: {
                type: String,
                default: ""
            },
            duration: {
                type: String,
                default: ""
            },
            position: {
                type: String,
                default: ""
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