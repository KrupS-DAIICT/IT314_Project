const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
    universityId: { type: String, required: true },
    name: { type: String, required: true },
});

const universitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    domain: { type: String, required: true },
    universityId: { type: String, required: true },
    colleges: [collegeSchema],
});

const University = mongoose.model('University', universitySchema);

module.exports = University;
