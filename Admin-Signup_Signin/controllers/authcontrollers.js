const validator = require("validator");
const Math = require("math");
const bcrypt = require('bcrypt');
const sendmail = require("../mails/sendemail");
const sendmail_accountlock = require("../mails/sendmaillock");
const sendmail_passwordreset = require("../mails/passwordresetlink");
const profileupdatesendmail = require("../mails/profileupdatemail");
const generateOTP = require("../mails/otp.js")
const mongoose = require("mongoose");
const { Sign_up, Signup_otp, Signin_count, Adminaccountlock, Admin_forgotpass_link } = require("../schema/reg.js");
require("../db/connection.js");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const { userdelete, checkuser, requireauth, adminlockupdate, } = require("./middlefunc");


const limit = 10 * 24 * 60 * 60;
const creattoken = (result, role) => {
    return jwt.sign({ _id: result._id, email: result.email, role: role }, 'secreat', {
        expiresIn: limit
    })
}
const saltRounds = 10;


module.exports.signup_post = async (req, res) => {
    const password = req.body.Password;
    const cpassword = req.body.cPassword;

    r = req.body;
    try {
        if (password === cpassword) {

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
                    } catch (err) {
                        console.log(err);
                    }
                    //await sendmail(req.body.email, otp);

                    setTimeout(userdelete, 300000, req.body.email);

                    try {
                        const user1 = new Sign_up({
                            name: req.body.Company_Name,
                            email: req.body.email,
                            password: await bcrypt.hash(password, saltRounds),
                            mobile_no: req.body.mobile_no,
                            university: req.body.university,
                            image: {
                                data: req.file.buffer.toString('base64'),
                                contentType: req.file.mimetype
                            }

                        });
                        const result1 = await user1.save();

                    } catch (err) {
                        console.log(err);

                    }
                    //res.render("otp.hbs");

                    // images=await Sign_up.findOne({ email: req.body.email });
                    // var data2 = images.image.data.toString('base64');
                    // const data3={
                    //     contentType:images.image.contentType,
                    //     data: data2
                    // }
                    // res.render("adminprofile2",{ images: images })
                    res.redirect('/otp')
                }
            }
            else {
                res.send(`<script>alert("Invalid Email Address");window.history.back();</script>`);
            }
        }
        else {
            res.send(`<script>alert("Your passwords do not match. Please try again");window.history.back()</script>`);
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error"
        })
    }

}



module.exports.signup_post_otp = async (req, res) => {
    const username = req.body.email;
    const user_otp = req.body.otp;

    try {
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
                        console.log("Invalid Details");
                        res.send(`<script>alert("Invalid Details"); window.history.back();</script>`);
                    }
                    else {
                        console.log("expired");
                        res.send(`<script>alert("OTP (One-Time Password) Expired"); window.history.back();</script>`);
                    }
                }
            }
            else {
                console.log("Email Already Verified");
                res.send(`<script>alert("Email Verification Already Completed"); window.location.href="/home";</script>`);
            }
        }
        else {
            console.log("Invalid Details");
            res.send(`<script>alert("Invalid Details"); window.history.back();</script>`);
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

module.exports.login_post = async (req, res) => {

    console.log(req.ip);
    const email = req.body.username;
    const password = req.body.password;
    const role = req.body.role;
    try {
        var result
        if (role === "admin") {
            console.log("admin is here1");
            result = await Sign_up.findOne({ $and: [{ email: email }, { verified: 1 }] }).exec();
        }
        else {

            //   add above but in faculty schema. finf wheater email is exist with verified

        }
        if (result) {
            console.log("i am in result")
            if (result.lock == 0) {
                const auth = await bcrypt.compare(password, result.password);
                if (auth) {
                    const result2 = await Signin_count.findOne({ $and: [{ ip: req.ip }, { email: req.body.username }] }).exec()
                    if (result2) {
                        await Signin_count.deleteOne({ _id: result2._id });
                    }
                    console.log(result);
                    const token = creattoken(result, role);
                    res.cookie("accesstoken", token, { httpOnly: true, maxAge: limit }).status(200)
                    console.log("sign-in done");
                    res.send(`<script>alert("You have successfully Signed in to your account"); window.location.href="/home";</script>`);

                }
                else {
                    const result2 = await Signin_count.findOne({ $and: [{ ip: req.ip }, { email: req.body.username }] }).exec()
                    if (result2) {
                        if (result2.count < 5) {
                            await Signin_count.updateOne({ _id: result2._id }, { count: result2.count + 1 });
                            console.log(result2);
                        }
                        else if (result2.count == 5) {
                            if (role === "admin")
                                await Sign_up.updateOne({ email: req.body.username }, { lock: 1 });
                            else {
                                // lock faculty profile as above
                            }
                            await Signin_count.updateOne({ _id: result2._id }, { count: result2.count + 1 });
                            setTimeout(adminlockupdate, 300000, req.body.username, req.body.role);

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
                            const resetLink = `http://localhost:7000/unlock-account?email=${req.body.username}?&role=${req.body.role}?&hash=${otp}`

                            //await sendmail_accountlock(req.body.username, resetLink);
                            console.log("sendmialllll");
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
                        } catch (err) {
                            console.log(err);

                        }
                    }
                    console.log("invalid details");
                    res.send(`<script>alert("Invalid Details"); window.history.back();</script>`);
                }
                // console.log(`${email} and ${password}`);
            }
            else {
                console.log("Your account has been locked");
                res.send(`<script>alert("Your account has been locked"); window.history.back();</script>`);

            }
        }
        else {
            console.log("Invalid Dtails");
            res.send(`<script>alert("Invalid Details"); window.history.back();</script>`);
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).send("Notfound");
    }

}



module.exports.unlock_account = async (req, res) => {
    try {
        //check for email and hash in query parameter
        if (req.query && req.query.email && req.query.hash && req.query.role) {
            //find user with suh email address
            console.log(req.query.email.slice(0, -1))
            const user = await Adminaccountlock.findOne({ $and: [{ email: req.query.email.slice(0, -1) }, { link: req.query.hash }] })

            console.log(user);
            console.log(req.query.role.slice(0, -1))
            //check if user object is not empty
            if (user) {
                if (req.query.role.slice(0, -1) === "admin") {
                    await Sign_up.updateOne({ email: req.query.email.slice(0, -1) }, { lock: 0 });
                }
                else {


                }
                await Signin_count.deleteOne({ email: req.query.email.slice(0, -1) });
                await Adminaccountlock.deleteOne({ email: req.query.email.slice(0, -1) });
                res.send("<h1>Account is unlocked</h1>")


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
};




module.exports.forgotpassword = async (req, res) => {
    try {
        //find a document with such email address
        const user1 = await Admin_forgotpass_link.findOne({ email: req.body.email })
        if (!user1) {

            var user;
            user = await Sign_up.findOne({ email: req.body.email })
            var role = "admin";
            if (!user) {
                // faculty
                role = "faculty"
            }
            //check if user object is not empty
            if (user) {
                //generate hash
                const otp = generateOTP(15);
                console.log(otp);
                //generate a password reset link
                try {
                    const user = new Admin_forgotpass_link({
                        email: req.body.email,
                        link: otp,

                    });
                    const result = await user.save();
                    console.log(result);
                    // res.send("<h1>Data recive successfully");
                } catch (err) {
                    console.log(err);
                }
                const resetLink = `http://localhost:7000/reset-pass?email=${user.email}?&role=${role}?&hash=${otp}`
                console.log(resetLink);


                //await sendmail_passwordreset(req.body.email, resetLink);
                //remember to send a mail to the user
                res.send(`<script>alert("link is share in your email"); window.history.back();</script>`);
            } else {
                //respond with an invalid email
                return res.status(400).json({
                    message: "Email Address is invalid"
                })
            }
        }
        else {
            res.send(`<script>alert("link is already share in your email"); window.history.back();</script>`);
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}




//reset route
module.exports.forgotpasswordlink = async (req, res) => {
    try {
        //check for email and hash in query parameter
        if (req.query && req.query.email && req.query.hash && req.query.role) {
            //find user with suh email address
            console.log(req.query.email.slice(0, -1))
            const user = await Admin_forgotpass_link.findOne({ $and: [{ email: req.query.email.slice(0, -1) }, { link: req.query.hash }] })

            console.log(user);

            //check if user object is not empty
            if (user) {
                const data = {
                    email: req.query.email.slice(0, -1),
                    role: req.query.role.slice(0, -1)
                }
                res.render("reset_pass.hbs", { data })
                //now check if hash is valid

            } else {
                return res.status(400).json({
                    message: "You have provided an invalid reset link"
                })
            }
        } else {
            //if there are no query parameters, serve the normal request form
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


module.exports.reset_pass_post = async (req, res) => {

    try{
    const user = await Admin_forgotpass_link.findOne({ email: req.query.email });
    if (user) {
        const password = req.body.pass;
        const cpassword = req.body.conpass;

        if (password === cpassword) {

            try {

                console.log(req.query.role);
                if (req.query.role === "admin") {
                    console.log("hellllo");
                    await Sign_up.updateOne({ email: req.query.email }, { password: await bcrypt.hash(password, saltRounds) });
                }
                else {
                    //faculty
                }
                await Admin_forgotpass_link.deleteOne({ email: req.query.email });
                res.cookie("accesstoken", '', { maxAge: 1 })
                res.send(`<script>alert("Your password has been changed successfully. You can now log in using your new password."); window.location.href="/login"; </script>`);
            }
            catch (err) {
                console.log(err)
                return res.status(500).json({
                    message: "Internal server error"
                })
            }
            //res1.send(`<script>window.open('', '_self', ''); window.close();</script>`);

        }
        else {
            res.send(`<script>alert("Your passwords do not match. Please try again"); window.history.back();</script>`);

        }
    }
    else {
        return res.status(400).json({
            message: "You have provided an invalid reset link"
        })
    }
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}


module.exports.admin_profile = async (req, res) => {
    const profileId = req.params.id;
    const token = req.cookies.accesstoken;
    const data = jwt.verify(token, 'secreat');
    console.log(res.locals);
    if (profileId === data._id  && data.role==="admin") {
        // Find the profile by ID in the database
        try {
            const profile = await Sign_up.findOne({ _id: profileId });
            if (profile && profile.email) {
                res.render('adminprofile.hbs', { profile:profile  });
            }
            else {
                res.status(400).json({
                    message: "Not found"
                })
            }
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    }
    else {
        return res.json({
            message: "You can not check other admin details"
        })
    }
}


module.exports.admin_profile_update = async (req, res) => {
    const profileId = req.params.id;
    const token = req.cookies.accesstoken;
    const data = jwt.verify(token, 'secreat');
    if(data.email !== req.body.email)
    {
        console.log("change email");
        res.cookie("accesstoken",'',{maxAge:1})
    }
    try {

        const result = await Sign_up.updateOne({ _id: profileId },
            {
                name: req.body.name,
                email: req.body.email,
                mobile_no: req.body.mobile_no,
                university: req.body.university
            });
    
       // console.log(result);
        //profileupdatesendmail(data.email,result.name);
        res.redirect("/home")
        
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}


module.exports.search_faculty = async (req, res) => {
    const course = req.query.course;
    const search_query = req.query.search2;
    const university = req.query.university;
    // Pagination parameters
    // const perPage = 6; // Number of results per page
    // const page = parseInt(req.query.page) || 1; // Current page, default to 1

    // Build the query based on the filters with $regex
    const query = {};
    const searchdata = {};
    // if (location) {
    //   query.location = { $regex: location, $options: 'i' };
    // }
    // if (course) {
    //   query.course = { $regex: course, $options: 'i' };
    // }
    try {
        if (university) {
            query.university = { $regex: university, $options: 'i' };
            searchdata.university = university
        }

        if (course) {
            query.course = { $regex: course, $options: 'i' };
            searchdata.course = course;
        }

        if (search_query) {
            query.name = { $regex: search_query, $options: 'i' };
            searchdata.search_query = search_query;
        }
        console.log(query);
        // Calculate the skip value for pagination
        //  const skip = (page - 1) * perPage;

        // Search the database with pagination and render the results in the search template
        const data = await Sign_up.find(query)
        // .skip(skip)
        if (data) {
            // console.log(data.length);
            // res.json(data);
            // const totalPages = Math.ceil(data.length/ perPage);
            // console.log(totalPages);
            // ,page: page, totalPages: totalPages,currentUrl:currentUrl


            res.render('search_faculty', { data: data, searchdata: searchdata });
        }

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
};


module.exports.changepassword_post = async (req, res) => {

    const token = req.cookies.accesstoken;
    const data = jwt.verify(token, 'secreat');
    try {
        var result
        if (data.role === "admin") {
            result = await Sign_up.findOne({ $and: [{ email: data.email }, { verified: 1 }] }).exec();
        }
        else {

        }
        if (result) {
            const auth = await bcrypt.compare(req.body.oldpassword, result.password);
            if (auth) {

                if (req.body.newpassword === req.body.cnewpassword) {
                    if (data.role === "admin") {
                        await Sign_up.updateOne({ email: data.email }, { password: await bcrypt.hash(req.body.newpassword, saltRounds) });
                        console.log("password is updates")
                        res.send(`<script>alert("Your Password is Updated");window.location.href="/home";</script>`);
                    }
                    else {

                    }
                }
                else {
                    res.send(`<script>alert("Passwords Do Not Match");window.history.back()</script>`);
                }
            }
            else {
                res.send(`<script>alert("Invalid Old Password");window.history.back();</script>`);
            }
        } else {
            res.send(`<script>alert("Invalid User");window.history.back();</script>`);
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error"
        })
    }

}


module.exports.unversitydata =async (req,res)=>{
    const searchdata = {};
    const university =req.query.university;
    const query={}
    if (university) {
        query.university = { $regex: university, $options: 'i' };
        searchdata.university = university
    }
    const data = await Sign_up.find(query,'university image');
    console.log(searchdata);
    res.locals.universitydata=data
    res.render("university",{searchdata:searchdata});
}