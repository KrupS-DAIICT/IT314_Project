const { Sign_up, Signup_otp ,Signin_count} = require("../schema/reg.js");
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
              const user=await Sign_up.findOne({ email: decodedToken.email}).exec();
              res.locals.user=user
              next();
            }
        }) 
    }
    else{
        res.locals.user =null;
        next();
    }
}

const userdelete = async (email) => {
    const r1 = await Sign_up.findOne({ email: email });
    if (r1.verified == 0) {
        const deletdata = await Sign_up.deleteOne({ email: email });
        console.log("delete data");
    }
}

const adminlockupdate = async (email) => {
    await Sign_up.updateOne({email:email }, { lock:0});
}

module.exports = {
    userdelete,checkuser,requireauth,adminlockupdate
}