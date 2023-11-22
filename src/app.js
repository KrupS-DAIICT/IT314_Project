require('dotenv').config();
require('./db/conn');

const express = require('express');
const session = require('express-session');
const path = require('path');
const hbs = require('hbs');
const cookieparser = require('cookie-parser');
const { checkUser } = require('./functions/userFunctions');

const app = express();
const port = process.env.PORT || 8000;

const static_path = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialPath);

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
}));


app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: false }));

hbs.registerHelper('eq', function (a, b) {
    return a === b;
});

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

const universityRouter = require("./routers/university");
app.use(universityRouter);

const addUniversityRouter = require("./routers/addUniversity"); // require signup.js
app.use(addUniversityRouter); // use signup.js

// routing - verifyotp
const verifyotpRouter = require("./routers/verifyotp"); // require verifyotp.js
app.use(verifyotpRouter); // use verifyotp.js

// // routing - otpverified
// const otpverifiedRouter = require("./routers/otpverified"); // require otpverified.js
// app.use(otpverifiedRouter); // use otpverified.js

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

const removeDataRouter = require("./routers/removeData");
app.use(removeDataRouter);


app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});