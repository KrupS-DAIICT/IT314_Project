const mogoose = require('mongoose');  // require mongoose

// Connect to database
mogoose.connect(process.env.DATABASE_NAME, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true
}).then(() => {
    console.log("Connection successful");
}).catch((err) => {
    console.log(`No connection, error: ${err}`);
});

