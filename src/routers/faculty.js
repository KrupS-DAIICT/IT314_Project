const express = require("express");
const path = require("path");
const multer = require("multer");
const handleExcel = require("../functions/handleExcel");
const router = express.Router();

const filePath = path.join(__dirname, "../../views", "addFaculty");

router.get("/addfaculty", async (req, res) => {
    res.render(filePath);
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage }); // multer configuration

// create a new faculty into the database
router.post("/addfaculty", upload.single("excelFile"), async (req, res) => {
    const excelAdded = await handleExcel(req, res);
});


module.exports = router; // export router