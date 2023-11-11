const express = require("express");
const bodyParser = require('body-parser');
const cookieparser = require("cookie-parser");
const controlers = require("./controllers/authcontrollers.js");
const pathm =require("path");
const multer=require("multer");
require("./db/connection.js");
require('dotenv').config()
const hbs = require("hbs");

var app = express();

app.set("view engine", "hbs");
app.set("views", "./views");


const { Sign_up, Signup_otp ,Signin_count} = require("./schema/reg.js");
const { checkuser, requireauth,setoption } = require("./controllers/middlefunc.js");
const { path } = require("express/lib/application.js");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieparser());
app.use(express.static(pathm.join(__dirname,"/public")));

// app.get("/", (req, res) => {
//     res.sendFile("/public/sign_up.html", { root: __dirname });

// })


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('*',checkuser);

app.get("/home",(req,res)=>{
    //res.end(`<h1>Hello ${res.locals.user.email}.   This is home page</h1>`);
    res.render("home");
})

app.get("/university",setoption,(req,res)=>{
    res.render("university");
})


app.get("/searchuniversity",setoption,controlers.unversitydata)

app.get('/signup',(req,res)=>{ 
    res.render('signup.hbs');
})

app.get('/login',(req,res)=>{
    
    res.render('signin.hbs');
    
})

app.get('/reset-pass', controlers.forgotpasswordlink);
app.get('/admin_profile/:id',requireauth,controlers.admin_profile);

app.get('/otp',(req,res)=>{
    res.render('otp');
})

app.get('/s',setoption,(req,res)=>{

    res.render('search_faculty');
})

app.get('/search',setoption,controlers.search_faculty);

app.post('/signup_post',upload.single('image'),controlers.signup_post)
app.post('/singup_otp',controlers.signup_post_otp);
app.post('/login', controlers.login_post);
app.post('/logout',requireauth,(req,res)=>{
    res.cookie("accesstoken",'',{maxAge:1})
    res.redirect("/login");
})

app.get("/resetlink",async (req,res) =>{
    res.render("reset_email.hbs");
})



app.post('/reset',controlers.forgotpassword);


app.post('/admin_profile_update/:id',upload.single('image'),controlers.admin_profile_update);

app.get('/unlock-account',controlers.unlock_account)

app.post("/reset-pass",controlers.reset_pass_post);

app.get("/changepassword",requireauth,(req,res)=>{
    res.render("changepassword");
})

app.post("/changepassword_post",requireauth,controlers.changepassword_post)

hbs.registerHelper('eq', function (a, b) {
    return a === b;
  });



app.listen(process.env.PORT);




