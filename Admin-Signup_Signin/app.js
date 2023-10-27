const express = require("express");
const bodyParser = require('body-parser');
const cookieparser = require("cookie-parser");
const controlers = require("./controllers/authcontrollers.js");
const pathm =require("path");
require("./db/connection.js");
require('dotenv').config()
const hbs = require("hbs");

var app = express();


app.set("view engine", "hbs");
app.set("views", "./views");

const { Sign_up, Signup_otp ,Signin_count} = require("./schema/reg.js");
const { checkuser, requireauth } = require("./controllers/middlefunc.js");
const { path } = require("express/lib/application.js");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieparser());

app.use(express.static(pathm.join(__dirname,"/public")));

// app.get("/", (req, res) => {
//     res.sendFile("/public/sign_up.html", { root: __dirname });

// })


app.get('*',checkuser);

app.get("/home",requireauth,(req,res)=>{
    res.end(`<h1>Hello ${res.locals.user.email}.   This is home page</h1>`);

})

app.get('/signup',(req,res)=>{
    
    res.render('signup.hbs');
})

app.get('/login',(req,res)=>{
    
    res.render('signin.hbs');
    
})

app.post('/api',controlers.signup_post)
app.post('/sub',controlers.signup_post_otp);
app.post('/login', controlers.login_post);
app.post('/logout',(req,res)=>{
    res.cookie("accesstoken",'',{maxAge:1})
    res.redirect("/login");
})

app.get('/unlock-account',controlers.unlock_account)
app.listen(process.env.PORT);