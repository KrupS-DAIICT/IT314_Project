require('dotenv').config();
const express = require("express");
const ExcelJS = require("exceljs");
const Faculty = require("../models/faculty");
const fs = require("fs");
const path = require("path");
const axios = require('axios');
const { log } = require("console");
const jwt = require("jsonwebtoken");
const { sendEmailLoginCredentials } = require("../functions/mails");
const { generateOTP } = require('./otpFunctions');
// const generateRandomPassword = require("../functions/generateRandomPassword")
const { adminLockUpdate, deleteAccount } = require('../functions/adminLockUpdate');
const verifyFaculty = require('../models/verifyFaculty');

function generateRandomPassword() {
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseLetters = lowercaseLetters.toUpperCase();
    const numbers = '0123456789';
    const specialCharacters = '#!@$%^&*_+-=';

    const getRandomChar = (charSet) => {
        const randomIndex = Math.floor(Math.random() * charSet.length);
        return charSet.charAt(randomIndex);
    };

    // Ensure at least one character from each character set
    const password =
        getRandomChar(lowercaseLetters) +
        getRandomChar(uppercaseLetters) +
        getRandomChar(numbers) +
        getRandomChar(specialCharacters) +
        // Include additional random characters to meet the desired length
        Array.from({ length: 4 }, () => getRandomChar(lowercaseLetters + uppercaseLetters + numbers + specialCharacters)).join('');

    // Shuffle the password to randomize the order of characters
    const shuffledPassword = password.split('').sort(() => Math.random() - 0.5).join('');

    return shuffledPassword;
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
        if (!req.files || !req.files['excelFile']) {
            return res.status(400).send("No file uploaded or invalid file format.");
        }

        const fileBuffer = req.files['excelFile'][0].buffer;
        const excelPath = path.join(__dirname, "../../public/uploads", req.files['excelFile'][0].originalname);
        // log(excelPath);
        fs.writeFileSync(excelPath, fileBuffer);

        const workbook = new ExcelJS.Workbook();
        workbook.csv.readFile(excelPath)
            .then(async () => {
                const worksheet = workbook.getWorksheet(1);
                const saveFacultyPromises = [];

                worksheet.eachRow({ includeEmpty: true }, async (row, rowNumber) => {
                    if (rowNumber > 1) {
                        const password = generateRandomPassword();
                        const facultyData = {
                            // this values changes according to the columns of excel File
                            // 1 based indexing
                            name: row.getCell(1).value,
                            institute: data.university,
                            email: row.getCell(5).value,
                            address: row.getCell(7).value,
                            password: password,
                            education: row.getCell(4).value,
                            website: row.getCell(6).value,
                            publications: row.getCell(8).value,
                            // contactNo: row.getCell(3).value,
                            // specialization: row.getCell(7).value,
                            // coursesTaught: row.getCell(9).value,
                            department: row.getCell(3).value,
                            // department: row.getCell(3).value,
                        };

                        const imageUrl = row.getCell(9).value;
                        if (imageUrl) {
                            const imageName = `image_${rowNumber}_${Date.now()}.jpeg`;
                            const imagePath = await downloadAndStoreImage(imageUrl, imageName);
                            // log("hello", imageName, imagePath);

                            if (imagePath) {
                                facultyData.image = {
                                    data: fs.readFileSync(imagePath, 'base64'),
                                    contentType: "image/jpeg",
                                };

                                fs.unlinkSync(imagePath);
                            }
                        }


                        // const mail = row.getCell(5).value;
                        // const university = data.university;
                        // const name = row.getCell(1).value;
                        // const otp = generateOTP(30);

                        // add data into verifyFaculty schema
                        // const verifyData = new verifyFaculty({
                        //     email: mail,
                        //     link: otp
                        // });
                        // await verifyData.save();

                        // send email before registring
                        // const port = process.env.PORT || 8000;
                        // const verifyLink = `http://localhost:${port}/verify-account?email=${mail}?&hash=${otp}`

                        // await sendEmailLoginCredentials(mail, university, password, name, verifyLink);
                        // setTimeout(deleteAccount, 1000 * 60 * 60 * 24 * 7, mail);


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
                console.log(err);
                res.status(500).send("Error reading Excel file");
            });
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal server error");
    }
};

module.exports = { handleExcel, generateRandomPassword };
