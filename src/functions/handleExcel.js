require('dotenv').config();
const express = require("express");
const ExcelJS = require("exceljs");
const Faculty = require("../models/faculty");
const fs = require("fs");
const path = require("path");
const axios = require('axios');
const { log } = require("console");
const jwt = require("jsonwebtoken");
// const generateRandomPassword = require("../functions/generateRandomPassword")

function generateRandomPassword() {
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseLetters = lowercaseLetters.toUpperCase();
    const numbers = '0123456789';
    const specialCharacters = '!@#$%^&*()_-+=<>?';

    const allCharacters = lowercaseLetters + uppercaseLetters + numbers + specialCharacters;

    let password = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * allCharacters.length);
        password += allCharacters.charAt(randomIndex);
    }

    return password;
}

const downloadAndStoreImage = async (imageUrl, imageName) => {
    const imagePath = path.join(__dirname, "../../public/images/", imageName);
    // log(imagePath);

    try {
        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(imagePath, response.data);
        log("Image downloaded and stored successfully:", imagePath);
        return imagePath;
    } catch (error) {
        console.error("Error downloading or storing image:", error.message);
        return null;
    }
};

const handleExcel = async (req, res) => {
    const token = req.cookies.accesstoken;
    const data = jwt.verify(token, process.env.SECRET_KEY);
    try {
        if (!req.file || !req.file.filename) {
            return res.status(400).send("No file uploaded or invalid file format.");
        }

        const excelPath = path.join(__dirname, "../../public/uploads", req.file.filename);
        // log(excelPath);

        const workbook = new ExcelJS.Workbook();
        workbook.csv.readFile(excelPath)
            .then(async () => {
                const worksheet = workbook.getWorksheet(1);
                const saveFacultyPromises = [];

                worksheet.eachRow({ includeEmpty: true }, async (row, rowNumber) => {
                    if (rowNumber > 1) {
                        const facultyData = {
                            // this values changes according to the columns of excel File
                            // 1 based indexing
                            name: row.getCell(1).value,
                            institute: data.university,
                            email: row.getCell(5).value,
                            address: row.getCell(4).value,
                            password: generateRandomPassword(),
                            education: row.getCell(2).value,
                            website: row.getCell(6).value,
                            publications: row.getCell(8).value,
                            contactNo: row.getCell(3).value,
                            specialization: row.getCell(7).value,
                            coursesTaught: row.getCell(9).value,
                            // department: row.getCell(3).value,
                        };

                        const imageUrl = row.getCell(10).value;
                        if (imageUrl) {
                            const imageName = `image_${rowNumber}_${Date.now()}.jpeg`;
                            const imagePath = await downloadAndStoreImage(imageUrl, imageName);
                            // log("hello", imageName, imagePath);

                            if (imagePath) {
                                facultyData.image = {
                                    data: fs.readFileSync(imagePath),
                                    contentType: "image/jpeg",
                                };

                                fs.unlinkSync(imagePath);
                            }
                        }

                        saveFacultyPromises.push(Faculty.create(facultyData));
                    }
                });

                // Wait for all faculty documents to be saved before deleting the file
                Promise.all(saveFacultyPromises)
                    .then(() => {
                        // Delete the saved file after all data is successfully saved
                        fs.unlinkSync(excelPath);
                        console.log("File deleted successfully");
                        res.status(200).send(`<script>alert("Data saved successfully."); window.history.back();</script>`);
                    })
                    .catch((saveError) => {
                        console.error("Error saving faculty data:", saveError);
                        res.status(500).send("Error saving faculty data");
                    });
            })
            .catch((err) => {
                console.log(err, "hello");
                res.status(500).send("Error reading Excel file");
            });
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal server error");
    }
};

module.exports = { handleExcel, generateRandomPassword };
