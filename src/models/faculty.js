require('dotenv').config();
const mongoose = require('mongoose'); // require mongoose
const validator = require('validator'); // require validator
const bcrypt = require('bcrypt'); // require bcrypt

const facultySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    institute: {
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
    contactNo: {
        type: Number,
        required: true,
        unique: true,
        minlength: 10, maxlength: 10,
    },
    Qualification: String,
    instituteOfEducation: String,
    fieldOfSpecialization: String,
    coursesTaught: String,
    website: {
        type: String,
        unique: true,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid Website");
            }
        }
    },
    publications: String,
    biography: String,
    // universityID: {
    //     type: Number,
    //     required: true
    // },
    // CollegeID: {
    //     type: Number,
    //     required: true
    // }
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