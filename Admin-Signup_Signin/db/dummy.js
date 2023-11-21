const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const hbs = require('hbs');
const path = require('path');

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/imageUpload', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Create a schema for the data
const imageDataSchema = new mongoose.Schema({
  username: String,
  height: Number,
  image: {
    data: Buffer,
    contentType: String
  }
});

const ImageData = mongoose.model('ImageData', imageDataSchema);

// Multer setup for file uploading
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Set up HBS as the view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Serve HTML file for image upload
app.get('/', (req, res) => {
  res.render('upload.hbs');
});

// Handle image upload
app.post('/upload', upload.single('image'), (req, res) => {
  const { username, height } = req.body;
  const image = {
    data: req.file.buffer,
    contentType: req.file.mimetype
  };

  const newImageData = new ImageData({ username, height, image });

  newImageData.save((err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect('/display');
  });
});

// Display uploaded image
app.get('/display', (req, res) => {
  ImageData.findOne({}, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.render('display.hbs', { imageData: data });
  });
});

// Start the server
app.listen(port, () => {
  console.log(Server is running on http://localhost:${port});
});







<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Image Upload</title>
</head>
<body>
  <form action="/upload" method="post" enctype="multipart/form-data">
    <label for="username">Username:</label>
    <input type="text" name="username" required><br>

    <label for="height">Height:</label>
    <input type="number" name="height" required><br>

    <label for="image">Choose image:</label>
    <input type="file" name="image" accept="image/*" required><br>

    <button type="submit">Upload</button>
  </form>
</body>
</html>








<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Display Image</title>
</head>
<body>
  <h1>Image Display</h1>
  <img src="data:{{imageData.image.contentType}};base64,{{imageData.image.data.toString('base64')}}" alt="Uploaded Image">
  <p>Username: {{imageData.username}}</p>
  <p>Height: {{imageData.height}}</p>
</body>
</html>