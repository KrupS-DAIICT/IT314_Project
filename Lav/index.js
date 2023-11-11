const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const hbs = require('hbs'); // Use hbs package for rendering views

require('./models/db');
const facultyController = require('./controller/facultyController.js');

var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Set up views and view engine
app.set('views', path.join(__dirname, '/views/'));
app.set('view engine', 'hbs'); // Set view engine to hbs

app.use(express.static(path.join(__dirname, 'public')));

// Set the 'views/layouts' directory
hbs.registerPartials(path.join(__dirname, '/views/layouts/'));
hbs.registerPartial('header', '<h1>University Faculty</h1>');

 app.use(express.static("public"));
//app.use('/faculty_images', express.static(path.join(path.resolve(), 'faculty_images')));


app.listen(3000, () => {
    console.log('Express server started at port : 3000');
});

app.use('/', facultyController);



