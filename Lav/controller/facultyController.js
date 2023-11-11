const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
var router = express.Router();
const Faculty = mongoose.model('Faculty');


// Set up Multer for file uploads

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/faculty_images/');
    },
    filename: function (req, file, cb) {
        //  cb(null, Date.now() + '-' + file.originalname);
     const fileExtension = file.originalname.split('.').pop();
       cb(null,req.body.facultyname +'.'+ fileExtension);
    },
  });

  const upload = multer({ storage: storage });

router.get('/addFaculty', (req, res) => {
    res.render('addFaculty'); // Assuming 'addFaculty' is the correct view name without the file extension
});

router.get("/", async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.render("facultyList", { faculties });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


router.post('/addFaculty', upload.single('file'), async (req, res) => {
 // const fileExtension = file.originalname.split('.').pop();
    try {
        const f1 = new Faculty({
            facultyName : req.body.facultyname,
        institute : req.body.institute,
        contactNo : req.body.contact,
        email : req.body. email,
        address: req.body.address,
        website : req.body.website,
        education: req.body.education,
        instituteOfEducation :req.body.institute_education,
        designation : req.body.designation,
        coursesTaught : req.body.courses_taught,
        publications : req.body.publications,
        biography : req.body.biography,
        imageName : req.file.filename,
        //imageName : req.body.facultyname +'.'+ fileExtension, 
        path :path.join(path.resolve(),req.file.path),
        //path :path.join(path.resolve(),req.file.path),
        });
      await f1.save();
      res.send('File uploaded successfully!');
    }
     catch (error) {
      res.status(500).send(error.message);
    }
});


router.get('/faculty/:facultyId', async (req, res) => {
  const facultyId = req.params.facultyId;
  //const facultyObjectId = new mongoose.Types.ObjectId(facultyId);
  try {
   // const faculty = await Faculty.findOne({ _id: facultyObjectId });
   const faculty = await Faculty.findOne({ _id: facultyId });
    if (!faculty) {
        return res.status(404).send('Faculty not found');
    }

    // Now you have the faculty document
    console.log(faculty);
    res.render('facultyProfile', { faculty });
} catch (error) {
    res.status(500).send(error.message);
}
});


  module.exports = router;


