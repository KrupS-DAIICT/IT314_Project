const mongoose = require("mongoose");

const facultySchema = mongoose.Schema({
    facultyName: { type: String, required: true },
    institute: { type: String, required: true },
    contactNo: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    website: { type: String },
    education: { type: String, required: true },
    instituteOfEducation: { type: String, required: true },
    designation: { type: String, required: true },
    
    coursesTaught: { type: String, required: true },
    publications: { type: String, required: true },
    biography: { type: String, required: true },
    imageName:{type: String},
    path: {type: String},
});

const Faculty = mongoose.model("Faculty", facultySchema);

//module.exports = Faculty;
