const validator = require("validator");
const bcrypt = require('bcrypt');
const sendmail = require("../mails/sendemail");
const sendmail_accountlock = require("../mails/sendmaillock");
const generateOTP = require("../mails/otp.js")
const mongoose = require("mongoose");
const { Sign_up, Signup_otp, Signin_count, Adminaccountlock } = require("../schema/reg.js");
require("../db/connection.js");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const { userdelete, checkuser, requireauth, adminlockupdate, } = require("./middlefunc");


const limit = 10 * 24 * 60 * 60;
const creattoken = (email) => {
    return jwt.sign({ id: email }, 'secreat', {
        expiresIn: limit
    })
}

module.exports.signup_post = async (req, res) => {
    const password = req.body.Password;
    const cpassword = req.body.cPassword;
    const saltRounds = 10;
    r = req.body;
    if (password == cpassword) {

        if (validator.isEmail(req.body.email)) {
            const userexist = await Sign_up.findOne({ email: req.body.email });
            if (userexist) {
                if (userexist.verified == 1)
                    res.send(`<script>alert("Email is already registerd"); window.history.back();</script>`);
                else
                    res.send(`<script>alert("Your previous verification is still pending"); window.history.back();</script>`);
            }
            else {
                const otp = generateOTP(6);
                console.log(otp);
                try {
                    const user = new Signup_otp({
                        email: req.body.email,
                        otp: otp,
                    });
                    const result = await user.save();
                    console.log(result);
                    // res.send("<h1>Data recive successfully");
                } catch (err) {
                    console.log(err);
                }
                //await sendmail(req.body.email,otp);

                setTimeout(userdelete, 300000, req.body.email);

                try {
                    const user1 = new Sign_up({
                        name: req.body.Company_Name,
                        email: req.body.email,
                        password: await bcrypt.hash(password, saltRounds),
                        mobile_no: req.body.mobile_no,
                        university: req.body.university

                    });
                    const result1 = await user1.save();
                    console.log(result1);
                    // res.send("<h1>Data recive successfully");
                } catch (err) {
                    console.log(err);

                }
                res.render("index.hbs");
            }
        }
        else {
            res.send(`<script>alert("Not a valid email"); window.location.href="/";</script>`);
        }
    }
    else {
        res.send(`<script>alert("Password is not matching"); window.location.href="/";</script>`);
    }
}



module.exports.signup_post_otp = async (req, res) => {
    const username = req.body.email;
    const user_otp = req.body.otp;


    const r1 = await Sign_up.findOne({ email: username });
    if (r1) {
        if (r1.verified == 0) {
            console.log('User Input:', user_otp);
            const r = await Signup_otp.findOne({ $and: [{ email: username }, { otp: user_otp }] });

            if (r) {
                console.log("donee");
                await Sign_up.updateOne({ email: username }, { verified: 1 });
                await Signup_otp.deleteOne({ email: username });

                // const token = creattoken(username);
                // res.cookie('jwt', token, { httpOnly: true, maxAge: limit })
                res.render("veri");
            }
            else {

                const r = await Signup_otp.findOne({ email: username }).exec();
                if (r) {
                    console.log("invalid dtails");
                    res.send(`<script>alert("invalid details"); window.history.back();</script>`);
                }
                else {
                    console.log("expired");
                    res.send(`<script>alert("OTP was expired"); window.history.back();</script>`);
                }
            }
        }
        else {
            console.log("email is already verified");
            res.send(`<script>alert("Email is already verified"); window.history.back();</script>`);
        }
    }
    else {
        console.log("invalid dtails");
        res.send(`<script>alert("invalid details"); wwindow.history.back();</script>`);
    }
}

module.exports.login_post = async (req, res) => {

    console.log(req.ip);
    const email = req.body.username;
    const password = req.body.password;
    try {
        //const result=await Sign_up.find({$and: [{email:email},{password:password}]});
        const result = await Sign_up.findOne({ $and: [{ email: email }, { verified: 1 }] }).exec();
        if (result) {
            if (result.lock == 0) {
                const auth = await bcrypt.compare(password, result.password);
                if (auth) {
                    const result2 = await Signin_count.findOne({ $and: [{ ip: req.ip }, { email: req.body.username }] }).exec()
                    if (result2) {
                        await Signin_count.deleteOne({ _id: result2._id });
                        console.log(result2);
                    }
                    console.log(result);
                    const token = creattoken(email);
                    res.cookie("accesstoken", token, { httpOnly: true, maxAge: limit }).status(200)
                    console.log("sign-in done");
                    res.send(`<script>alert("Signin done"); window.history.back();</script>`);

                }
                else {
                    const result2 = await Signin_count.findOne({ $and: [{ ip: req.ip }, { email: req.body.username }] }).exec()
                    if (result2) {
                        if (result2.count < 5) {
                            await Signin_count.updateOne({ _id: result2._id }, { count: result2.count + 1 });
                            console.log(result2);
                        }
                        else if (result2.count == 5) {

                            await Sign_up.updateOne({ email: req.body.username }, { lock: 1 });
                            await Signin_count.updateOne({ _id: result2._id }, { count: result2.count + 1 });
                            setTimeout(adminlockupdate, 300000, req.body.username);

                            const otp = generateOTP(30);
                            console.log(otp);
                            try {
                                const user = new Adminaccountlock({
                                    email: req.body.username,
                                    link: otp,

                                });
                                const result6 = await user.save();
                                console.log(result6);
                                // res.send("<h1>Data recive successfully");
                            } catch (err) {
                                console.log(err);
                            }
                            const resetLink = `http://localhost:7000/unlock-account?email=${req.body.username}?&hash=${otp}`

                            //await sendmail_accountlock(req.body.username,resetLink);
                            console.log("sendmialllllllllllllllll");
                        }
                        else {
                            await Signin_count.updateOne({ _id: result2._id }, { count: result2.count + 1 });
                        }
                    }
                    else {
                        try {
                            const user = new Signin_count({
                                ip: req.ip,
                                email: req.body.username,
                                count: 1

                            });
                            const result1 = await user.save();
                            console.log(result1);
                            // res.send("<h1>Data recive successfully");
                        } catch (err) {
                            console.log(err);

                        }
                    }
                    console.log("invalid dtails");
                    res.send(`<script>alert("invalid details"); window.history.back();</script>`);
                }
                // console.log(`${email} and ${password}`);
            }
            else {
                console.log("Locked");
                res.send(`<script>alert("Locked"); window.history.back();</script>`);

            }
        }
        else {
            console.log("invalid dtails");
            res.send(`<script>alert("invalid details"); window.history.back();</script>`);
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).send("notfound");
    }

}



module.exports.unlock_account = async (req, res) => {
    try {
        //check for email and hash in query parameter
        if (req.query && req.query.email && req.query.hash) {
            //find user with suh email address
            console.log(req.query.email.slice(0, -1))
            const user = await Adminaccountlock.findOne({ $and: [{ email: req.query.email.slice(0, -1) }, { link: req.query.hash }] })

            console.log(user);

            //check if user object is not empty
            if (user) {
                await Sign_up.updateOne({ email: req.query.email.slice(0, -1) }, { lock: 0 });
                await Signin_count.deleteOne({ email: req.query.email.slice(0, -1) });
                await Adminaccountlock.deleteOne({ email: req.query.email.slice(0, -1) });
                res.send("<h1>unlocked</h1>")
             

            } else {
                return res.status(400).json({
                    message: "You have provided an invalid reset link"
                })
            }
        } else {
          
            return res.status(400).json({
                message: "You have provided an invalid reset link"
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}