const mongoose = require("mongoose");

mongoose.
connect("mongodb://127.0.0.1:27017",{
    dbName:"UniversityFaculty",
})
.then(() =>{
    console.log("Database connected");
})
.catch((e)=>{
    console.log(e)
});
 require("./faculty.model.js");