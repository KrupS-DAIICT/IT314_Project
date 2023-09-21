const validator= require("validator");
const express = require("express");
const bodyParser = require('body-parser');

const sendmail=require("./sendemail");
const otpGenerator=require("otp-generator");
const mongoose =require("mongoose");

const generateOTP = ()=> {
    const OTP = otpGenerator.generate(6,{
        specialChars:false,
        upperCaseAlphabets:false,
        lowerCaseAlphabets :false
    });
    return OTP;
};

module.exports = generateOTP();

const userdelete =async (email)=>{
    const r1= await Sign_up.findOne({email:email});
    if(r1.verified==0)
    {
        const deletdata =await Sign_up.deleteOne({email:email});
        console.log("delete data");
    }
}

const hbs = require("hbs");

var app = express();
require("./db/connection.js");
app.set("view engine","hbs");
app.set("views","./views");


const {Sign_up,Signup_otp}=require("./schema/reg.js");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile("/public/sign_up.html", { root: __dirname });
   
})





app.post('/api',async (req, res) => {
   
    const password= req.body.Password;
    const cpassword=req.body.cPassword;
    r=req.body;
    if(password==cpassword)
    {
        if(validator.isEmail(req.body.email))
        {
            const userexist=await Sign_up.findOne({ email: req.body.email});
            if(userexist)
            {
                res.send(`<script>alert("Email is already registerd"); window.location.href="/";</script>`);
            }
            else{
                const otp=generateOTP();
                console.log(otp);
                try{
                    const user = new Signup_otp({
                    email: req.body.email,
                    otp: otp,
                
                    });
                const result = await user.save();
                console.log(result); 
            // res.send("<h1>Data recive successfully");
                }catch(err){
                    console.log(err);
                }
              
           //await sendmail(req.body.email,otp);

            setTimeout(userdelete,300000,req.body.email);
            try{
               const user1 = new Sign_up({
               name: req.body.Company_Name,
               email: req.body.email,
               password: req.body.Password,
               mobile_no: req.body.mobile_no,
               university: req.body.university
           
            });
                const result1 = await user1.save();
                console.log(result1);
                // res.send("<h1>Data recive successfully");
            }catch(err){
               console.log(err);
               
            }
                res.render("index.hbs");
            }
        }
        else
        {
            res.send(`<script>alert("Not a valid email"); window.location.href="/";</script>`);
        }
    }
    else{   
        res.send(`<script>alert("Password is not matching"); window.location.href="/";</script>`);
    }
    })

    app.post('/sub',async (req, res) => {

        const username=req.body.email;
        const user_otp=req.body.otp;


        const r1= await Sign_up.findOne({email:username});
        if(r1)
        {
        if(r1.verified==0)
        {
            console.log('User Input:', user_otp);
            const r= await Signup_otp.findOne({$and: [{email:username},{otp:user_otp}]});
        
            if(r)
            {
                console.log("donee");
                await Sign_up.updateOne({email:username},{verified:1});
                await Signup_otp.deleteOne({email:username});

                res.render("veri");
        }
        else{
            
            const r= await Signup_otp.findOne({email:username}).exec();
            if(r)
            {
                console.log("invalid dtails");
                res.send(`<script>alert("invalid details"); window.history.back();</script>`);
            }
            else{
                console.log("expired");
                res.send(`<script>alert("OTP was expired"); window.history.back();</script>`);
            }    
        }
}
else{
    console.log("email is already verified");
    res.send(`<script>alert("Email is already verified"); window.history.back();</script>`);
}
        }
else{
    console.log("invalid dtails");
    res.send(`<script>alert("invalid details"); wwindow.history.back();</script>`);
}

    })



    

app.listen(7000);