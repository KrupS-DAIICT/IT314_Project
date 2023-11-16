const mongoose = require('mongoose'); // require mongoose

const signinCountSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true
    },
    ip: {
        type: String,
        trim: true
    },
    count: {
        type: Number,
        default: 0
    },
    end_time: {
        type: Date,
        default: Date.now,
        expires: 60 * 5
    }
});

// Create a new collection(Table)
const SigninCount = new mongoose.model("SigninCount", signinCountSchema);
module.exports = SigninCount; // export Faculty