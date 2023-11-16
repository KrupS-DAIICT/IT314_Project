require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const checkSignupStep = require('./middleware/checkSignupStep');
const hbs = require('hbs');
const cookieparser = require('cookie-parser');
const checkUser = require('./functions/checkUser');

require('./db/conn');

const app = express();

const port = process.env.PORT || 8000;
const static_path = path.join(__dirname, "../public");

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
}));

// middlewares
app.use(checkSignupStep); // use checkSignupStep

app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", "./views");

app.get('*', checkUser);

// routing - Home Page
const homePageRouter = require("./routers/index"); // require home.js
app.use(homePageRouter); // use home.js
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

// routing - unlockAccount
const unlockAccountRouter = require("./routers/unlockAccount");
app.use(unlockAccountRouter);

// routing - forgotPassword
const forgotPasswordRouter = require("./routers/forgotPassword");
app.use(forgotPasswordRouter);

const adminProfileRouter = require("./routers/adminProfile")
app.use(adminProfileRouter);

const changePasswordRouter = require("./routers/changePassword");
app.use(changePasswordRouter);

const searchFacultyRouter = require("./routers/searchFaculty");
app.use(searchFacultyRouter);


app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});