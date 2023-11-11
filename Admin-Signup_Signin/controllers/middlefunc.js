const { Sign_up, Signup_otp, Signin_count, Adminaccountlock, Admin_forgotpass_link } = require("../schema/reg.js");
const jwt = require("jsonwebtoken");
require('dotenv').config()

const requireauth = (req,res,next) =>{
    const token= req.cookies.accesstoken;
    
    if(token){
        jwt.verify(token,'secreat',(err,decodedToken)=>{
            
            if(err){
                res.redirect('/login');
            }
            else{
                
                next();
               
            }
        }) 
    }
    else{
        res.redirect('/login');
    }
}       

const checkuser = (req,res,next) =>{
    const token= req.cookies.accesstoken;
    
    if(token){
        jwt.verify(token,'secreat',async (err,decodedToken)=>{
            if(err){
                res.locals.user=null;
                next();
            }
            else{
                try{
                    if(decodedToken.role === "admin"){
                    const user=await Sign_up.findOne({ email: decodedToken.email}).exec();
                    res.locals.user=user
                    }
                    else{
                    //faculty
                    }
              next();
                }
                catch(err){
                    console(err);
                }
            }
        }) 
    }
    else{
        res.locals.user =null;
        next();
    }
}


const setoption =async (req,res,next) =>{
    
try{
    const universityoption=await Sign_up.find({},'university image').exec();
    res.locals.universityoption=universityoption;
    res.locals.universitydata=universityoption
    next();
}
catch(err){
    console.log(err)
}
}

const userdelete = async (email) => {
    try{
    const r1 = await Sign_up.findOne({ email: email });
    if (r1.verified == 0) {
        const deletdata = await Sign_up.deleteOne({ email: email });
        console.log("delete data");
    }
}
catch(err){
    console.log(err);
}
}

const adminlockupdate = async (email,role) => {
    try{
        if(role==="admin")
        {
            await Sign_up.updateOne({email:email }, { lock:0});
        }
        else{

        }
    }
    catch{
        console.log(err);
    }
}

module.exports = {
    userdelete,checkuser,requireauth,adminlockupdate,setoption
}