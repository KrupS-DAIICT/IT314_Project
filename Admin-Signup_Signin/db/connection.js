const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/Project-IT314',
  {
    useNewUrlParser: true,
    
    useUnifiedTopology: true,
    family: 4
  }
).then(()=>console.log("successfully connected to http://localhost:/7000")).catch((err)=> console.log(err));
