const express = require("express");
const cors = require("cors");
const router = express.Router();
const { authenticateToken } = require("./tools");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const multer = require("multer");
const fileUpload = multer();

//we need that CLIENT_ID from heroku
require("dotenv").config();

//middleware
router.use(
    cors({
        origin: true,
        credentials: true,
        useFindAndModify: false,
    })
);
router.use(express.json());

//this is our connection to the image api, read from .env locally on heroku server
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

router.get("/all", authenticateToken, async (request, response) => {
    try {
        let res = await cloudinary.search
            .expression(
                "resource_type:image"
            )
            .sort_by("public_id", "desc")
            .max_results(30)
            .execute()
            .then((result) => result);
        response.send({ status: true, images: res.resources });
    } catch (error) {
        response.send({ status: false, message: error });
    }
});

router.post("/upload", authenticateToken, fileUpload.single("image"), (request, response, next) => {
    const streamUpload = (request) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream((error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            });
            streamifier.createReadStream(request.file.buffer).pipe(stream);
        });
    };

    const upload = async (req) => {
        try {
            let result = await streamUpload(request);
            response.send({ status: true, result: result });
        } catch (error) {
            response.send({ status: false, message: error.toString() });
        }
    };

    //execute
    upload(request);
});

module.exports = router;
