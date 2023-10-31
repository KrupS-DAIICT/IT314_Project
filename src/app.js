require('dotenv').config();
const express = require('express');
const path = require('path');

require('./db/conn');

const app = express();

const port = process.env.PORT || 8000;
const static_path = path.join(__dirname, "../public");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set("view engine", "hbs");

// routing - add faculty
const facultyRouter = require("./routers/faculty"); // require faculty.js
app.use(facultyRouter); // use faculty.js

// routing - signin
const signinRouter = require("./routers/signin"); // require signin.js
app.use(signinRouter); // use signin.js

// routing - signup
const signupRouter = require("./routers/signup"); // require signup.js
app.use(signupRouter); // use signup.js

// routing - verifyotp
const verifyotpRouter = require("./routers/verifyotp"); // require verifyotp.js
app.use(verifyotpRouter); // use verifyotp.js

// routing - otpverified
const otpverifiedRouter = require("./routers/otpverified"); // require otpverified.js
app.use(otpverifiedRouter); // use otpverified.js

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});