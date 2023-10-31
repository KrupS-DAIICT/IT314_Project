const express = require("express");
const ExcelJS = require("exceljs");
const Faculty = require("../models/faculty");
const fs = require("fs");
const path = require("path");

const handleExcel = async (req, res) => {
    try {
        if (!req.file || !req.file.filename) {
            return res.status(400).send("No file uploaded or invalid file format.");
        }

        const excelPath = path.join(__dirname, "../../public/uploads", req.file.filename);

        const workbook = new ExcelJS.Workbook();
        workbook.xlsx.readFile(excelPath)
            .then(async () => {
                const worksheet = workbook.getWorksheet(1);
                const saveFacultyPromises = [];

                worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                    const facultyData = {
                        name: row.getCell(1).value,
                        institute: row.getCell(2).value,
                        email: row.getCell(3).value,
                        contactNo: row.getCell(4).value,
                        education: row.getCell(5).value,
                        instituteOfEducation: row.getCell(6).value,
                        fieldOfSpecialization: row.getCell(7).value,
                        courcesTaught: row.getCell(8).value,
                        website: row.getCell(9).value,
                        publications: row.getCell(10).value,
                        biography: row.getCell(11).value,
                    };

                    saveFacultyPromises.push(Faculty.create(facultyData));
                });

                // Wait for all faculty documents to be saved before deleting the file
                Promise.all(saveFacultyPromises)
                    .then(() => {
                        // Delete the saved file after all data is successfully saved
                        fs.unlinkSync(excelPath);
                        console.log("File deleted successfully");
                        res.status(200).send("Data saved and file deleted");
                    })
                    .catch((saveError) => {
                        console.error("Error saving faculty data:", saveError);
                        res.status(500).send("Error saving faculty data");
                    });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).send("Error reading Excel file");
            });
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal server error");
    }
};

module.exports = handleExcel;
