const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Configure the storage strategy for uploaded photos
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Connect to the MongoDB database (replace the URL with your database connection string)
mongoose.connect('mongodb://localhost/university', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the faculty profile schema
const facultyProfileSchema = new mongoose.Schema({
  name: String,
  photo: Buffer,
  email: String,
  contact: String,
  website: String,
  address: String,
  designation: String,
  education: String,
  publications: String,
  coursesTaught: String,
  biography: String,
  specialization: String,
});

// Create the FacultyProfile model
const FacultyProfile = mongoose.model('FacultyProfile', facultyProfileSchema);

// Configure Handlebars as the view engine
app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts/'),
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (e.g., CSS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Handle GET request to render the faculty addition form
app.get('/add', (req, res) => {
  res.render('add-faculty');
});

// Handle POST request to add a new faculty profile
app.post('/add', upload.single('photo'), (req, res) => {
  const facultyData = req.body;
  const photoData = req.file.buffer;

  const newFacultyProfile = new FacultyProfile({
    ...facultyData,
    photo: photoData,
  });

  newFacultyProfile.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving faculty profile');
    } else {
      res.redirect('/faculty');
    }
  });
});

// Handle GET request to display faculty profiles
app.get('/faculty', (req, res) => {
  FacultyProfile.find({}, (err, facultyProfiles) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching faculty profiles');
    } else {
      res.render('faculty', { facultyProfiles });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
