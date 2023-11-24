const express = require('express'); // require express
const app = express(); // create express app
const mogoose = require('mongoose');  // require mongoose
require('dotenv').config(); // require dotenv

const port = process.env.PORT || 8000;

// Connect to database
mogoose.connect("mongodb://127.0.0.1:27017/FacultyHub" || process.env.DATABASE_URL || , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true
}).then(() => {
    console.log("Connection successful");
    app.listen(port, () => {
        console.log(`Server is running at port ${port}`);
    });
}).catch((err) => {
    console.log(`No connection, error: ${err}`);
});

