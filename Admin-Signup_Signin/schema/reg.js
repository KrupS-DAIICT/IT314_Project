const mongoose=require("mongoose");

const Sign_up_Schema= new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique : true,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    mobile_no:{

        type: String,
        trim: true
    },
    university: {
        type: String,
        trim: true

    },
    verified :{
        type:Number,
        default:0
    },
    lock :{
        type:Number,
        default:0
    }
    
})


const Sign_up_otp_Schema= new mongoose.Schema({
    
    email: {
        type: String,
        unique : true,
        trim: true
    },
    
    otp: {
        type:String,
        trim : true
    },
   
    end_time: {
        type:Date,
        default: Date.now,
        expires: 60 * 5, 
    }
    
    
})

const Resrtrict_signin_schema= new mongoose.Schema({
    ip: {
        type: String,
        trim: true
    },
    email: {
        type:String,
        trim : true
    },
    count:{
        type:Number
    },
    end_time: {
        type:Date,
        default: Date.now,
        expires: 60 * 5, 
    }

})

const Admin_acountloc_schema= new mongoose.Schema({
    
    email: {
        type: String,
        unique : true,
        trim: true
    },
    
    link: {
        type:String,
        trim : true
    },
   
    end_time: {
        type:Date,
        default: Date.now,
        expires: 60 * 5, 
    }
    
    
})



const Admin_forgotpass_schema= new mongoose.Schema({
    
    email: {
        type: String,
        unique : true,
        trim: true
    },
    
    link: {
        type:String,
        trim : true
    },
   
    end_time: {
        type:Date,
        default: Date.now,
        expires: 60 * 5, 
    }
    
    
})


const Admin_forgotpass_link =new mongoose.model("Admin_forgotpass_link",Admin_forgotpass_schema);

const Sign_up = new mongoose.model("playlist",Sign_up_Schema);
const Signup_otp =new mongoose.model("Signup_otp",Sign_up_otp_Schema);
const Signin_count =new mongoose.model("Signin_count",Resrtrict_signin_schema);
const Adminaccountlock =new mongoose.model("Adminaccountlock",Admin_acountloc_schema);
module.exports = {Sign_up,Signup_otp,Signin_count,Adminaccountlock,Admin_forgotpass_link}

