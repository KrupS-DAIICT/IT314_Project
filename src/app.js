require('dotenv').config(); // require dotenv
const express = require('express'); // require express
const path = require('path'); // require path
const hbs = require('hbs'); // require hbs

require('./db/conn'); // require conn.js

const app = express(); // create express app

const port = process.env.PORT || 8000; // set port
const static_path = path.join(__dirname, "../public"); // set static path

app.use(express.json()); // use json
app.use(express.urlencoded({ extended: false })); // use urlencoded
app.use(express.static(static_path)); // use static path
app.set("view engine", "hbs"); // set view engine

// routing - add faculty
const facultyRouter = require("./routers/faculty"); // require faculty.js
app.use(facultyRouter); // use faculty.js

// routing - signin
const signinRouter = require("./routers/signin"); // require signin.js
app.use(signinRouter); // use signin.js

// routing - signup
const signupRouter = require("./routers/signup"); // require signup.js
app.use(signupRouter); // use signup.js

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});