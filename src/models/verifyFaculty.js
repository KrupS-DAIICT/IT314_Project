const mongoose = require('mongoose'); // require mongoose

const verifyFacultySchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        trim: true
    },
    link: {
        type: String,
        trim: true
    },
    end_time: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 7 // expires in 7 days
    }
});

// Create a new collection(Table)
const verifyFaculty = new mongoose.model("verifyFaculty", verifyFacultySchema);
module.exports = verifyFaculty; // export 