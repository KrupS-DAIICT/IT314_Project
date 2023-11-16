const mongoose = require('mongoose'); // require mongoose

const forgotPasswordSchema = new mongoose.Schema({
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
        expires: 60 * 5
    }
});

// Create a new collection(Table)
const forgotPass = new mongoose.model("forgotPass", forgotPasswordSchema);
module.exports = forgotPass; // export Faculty